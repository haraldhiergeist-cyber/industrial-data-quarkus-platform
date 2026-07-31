package com.plc.collector.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.example.industrial.contracts.model.Quality;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Clock;
import java.time.Instant;

@ApplicationScoped
public class PlcReadingEventMapper {

    private final Clock clock;

    public PlcReadingEventMapper() {
        this(Clock.systemUTC());
    }

    PlcReadingEventMapper(Clock clock) {
        this.clock = clock;
    }

    public PlcReadingEvent toEvent(PlcReader.PlcReading reading) {
        Object rawValue = reading.value();
        return new PlcReadingEvent(
                reading.source(),
                reading.tagName(),
                reading.address(),
                rawValue == null ? "UNKNOWN" : rawValue.getClass().getSimpleName(),
                rawValue == null ? null : String.valueOf(rawValue),
                Instant.now(clock),
                Quality.GOOD
        );
    }
}
