package com.plc.query.history;

import java.time.Duration;

public enum MeasurementRange {
    LAST_5_MINUTES(Duration.ofMinutes(5)),
    LAST_15_MINUTES(Duration.ofMinutes(15)),
    LAST_1_HOUR(Duration.ofHours(1)),
    LAST_24_HOURS(Duration.ofHours(24));

    private final Duration duration;

    MeasurementRange(Duration duration) {
        this.duration = duration;
    }

    public Duration getDuration() {
        return duration;
    }
}
