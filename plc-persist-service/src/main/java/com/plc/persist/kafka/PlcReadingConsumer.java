package com.plc.persist.kafka;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.persist.service.MeaningfulChangeFilter;
import com.plc.persist.service.PlcReadingPersistenceService;
import io.quarkus.logging.Log;
import io.smallrye.reactive.messaging.annotations.Blocking;
import io.smallrye.reactive.messaging.kafka.api.IncomingKafkaRecordMetadata;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;
import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class PlcReadingConsumer {

    private final MeaningfulChangeFilter changeFilter;
    private final PlcReadingPersistenceService persistenceService;

    public PlcReadingConsumer(
            MeaningfulChangeFilter changeFilter,
            PlcReadingPersistenceService persistenceService) {
        this.changeFilter = changeFilter;
        this.persistenceService = persistenceService;
    }

 
	@Incoming("plc-readings-in")
	@Blocking
	public CompletionStage<Void> consume(Message<PlcReadingEvent> message) {
		try {
			PlcReadingEvent event = message.getPayload();

			var metadata = message
					.getMetadata(IncomingKafkaRecordMetadata.class)
					.orElseThrow(() ->
							new IllegalStateException("Kafka record metadata is missing"));

			if (!changeFilter.hasMeaningfulChange(event)) {
				Log.debugf(
						"Unchanged PLC value skipped: tag=%s, offset=%d",
						event.tagName(),
						metadata.getOffset());

				return message.ack();
			}

			var result = persistenceService.persist(
					event,
					metadata.getTopic(),
					metadata.getPartition(),
					metadata.getOffset());

			changeFilter.remember(event);

			if (result == PlcReadingPersistenceService.PersistResult.PERSISTED) {
				Log.infof(
						"PLC reading persisted: topic=%s, partition=%d, offset=%d",
						metadata.getTopic(),
						metadata.getPartition(),
						metadata.getOffset());
			} else {
				Log.infof(
						"Duplicate PLC reading ignored: topic=%s, partition=%d, offset=%d",
						metadata.getTopic(),
						metadata.getPartition(),
						metadata.getOffset());
			}

			return message.ack();
		} catch (Exception exception) {
			Log.error("Failed to process PLC reading", exception);
			return message.nack(exception);
		}
	}
}
