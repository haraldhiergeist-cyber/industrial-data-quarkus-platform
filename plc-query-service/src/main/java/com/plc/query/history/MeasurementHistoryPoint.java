package com.plc.query.history;

import java.time.Instant;

public record MeasurementHistoryPoint(Instant timestamp, double value) {
}
