package com.plc.persist.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.persist.entity.PlcReadingEntity;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Clock;
import java.time.Instant;

@ApplicationScoped
public class PlcReadingMapper {

    private final Clock clock;

    public PlcReadingMapper() {
        this(Clock.systemUTC());
    }

    PlcReadingMapper(Clock clock) {
        this.clock = clock;
    }

    public PlcReadingEntity toEntity(
            PlcReadingEvent event,
            String topic,
            int partition,
            long offset) {
        PlcReadingEntity entity = new PlcReadingEntity();
        entity.source = event.source();
        entity.tagName = event.tagName();
        entity.address = event.address();
        entity.dataType = event.dataType();
        entity.valueAsString = event.valueAsString();
        entity.eventTime = event.timestamp();
        entity.quality = event.quality() == null ? "UNKNOWN" : event.quality().name();
        entity.receivedTime = Instant.now(clock);
        entity.kafkaTopic = topic;
        entity.kafkaPartition = partition;
        entity.kafkaOffset = offset;
        return entity;
    }
}
