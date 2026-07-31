package com.plc.query.history;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Clock;
import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class MeasurementHistoryService {

    private final PlcReadingRepository repository;
    private final Clock clock;

    @Inject
    public MeasurementHistoryService(PlcReadingRepository repository) {
        this(repository, Clock.systemUTC());
    }

    MeasurementHistoryService(PlcReadingRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    public List<MeasurementHistoryPoint> loadHistory(MeasurementMetric metric, MeasurementRange range) {
        Instant to = Instant.now(clock);
        Instant from = to.minus(range.getDuration());
        return repository.findBetween(resolveTagName(metric), from, to).stream()
                .map(entity -> new MeasurementHistoryPoint(
                        entity.eventTime,
                        Double.parseDouble(entity.valueAsString)))
                .toList();
    }

    private String resolveTagName(MeasurementMetric metric) {
        return switch (metric) {
            case TEMPERATURE -> "temperature";
            case PRESSURE -> "pressure";
            case LEVEL -> "level";
        };
    }
}
