package com.plc.query.history;

import com.example.industrial.contracts.historic.HistoryPoint;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class PlcHistoryService {

    private final PlcReadingRepository repository;

    public PlcHistoryService(PlcReadingRepository repository) {
        this.repository = repository;
    }

    public List<HistoryPoint> getTemperatureHistory() {
        return repository.findLatestByTag("temperature", 500).stream()
                .map(entity -> new HistoryPoint(entity.eventTime, entity.valueAsString))
                .toList();
    }
}
