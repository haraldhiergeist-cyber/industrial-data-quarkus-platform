package com.example.industrial.contracts.historic;

import java.time.Instant;

public record HistoryPoint(
        Instant timestamp,
        Object value
) {
}