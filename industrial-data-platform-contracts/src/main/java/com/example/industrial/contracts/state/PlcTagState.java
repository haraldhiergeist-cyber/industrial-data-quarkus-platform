package com.example.industrial.contracts.state;

import com.example.industrial.contracts.model.Quality;

import java.time.Instant;

public record PlcTagState(
        String source,
        String tagName,
        String address,
        String dataType,
        String value,
        Instant timestamp,
        Quality quality
) {
}
