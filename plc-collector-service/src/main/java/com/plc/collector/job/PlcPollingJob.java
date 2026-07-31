package com.plc.collector.job;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.collector.service.PlcReader;
import com.plc.collector.service.PlcReadingEventMapper;
import io.quarkus.logging.Log;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import static io.quarkus.scheduler.Scheduled.ConcurrentExecution.SKIP;

@ApplicationScoped
public class PlcPollingJob {

    private final PlcReader reader;
    private final PlcReadingEventMapper mapper;
    private final Emitter<PlcReadingEvent> emitter;

    public PlcPollingJob(
            PlcReader reader,
            PlcReadingEventMapper mapper,
            @Channel("plc-readings-out") Emitter<PlcReadingEvent> emitter) {
        this.reader = reader;
        this.mapper = mapper;
        this.emitter = emitter;
    }

    @Scheduled(
            identity = "plc-polling",
            every = "${plc.poll-interval:1s}",
            concurrentExecution = SKIP,
            description = "Read configured PLC tags and publish them to Kafka")
    void poll() {
        try {
            for (PlcReader.PlcReading reading : reader.readAll()) {
                PlcReadingEvent event = mapper.toEvent(reading);
                emitter.send(event).whenComplete((ignored, failure) -> {
                    if (failure != null) {
                        Log.errorf(failure, "Unable to publish PLC reading %s", event.tagName());
                    }
                });
            }
        } catch (Exception exception) {
            Log.error("PLC polling failed", exception);
        }
    }
}
