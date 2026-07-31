package com.example.industrial.contracts.event;

import com.example.industrial.contracts.model.Quality;

import java.time.Instant;

public record PlcReadingEvent(
        String source,
        String tagName,
        String address,
        String dataType,
        String valueAsString,
        Instant timestamp,
        Quality quality
) {
}
