package com.plc.persist.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.persist.entity.PlcReadingEntity;
import com.plc.persist.repository.PlcReadingRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PlcReadingPersistenceService {

    private final PlcReadingMapper mapper;
    private final PlcReadingRepository repository;

    public PlcReadingPersistenceService(PlcReadingMapper mapper, PlcReadingRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    @Transactional
    public PersistResult persist(
            PlcReadingEvent event,
            String kafkaTopic,
            int kafkaPartition,
            long kafkaOffset) {
        PlcReadingEntity entity = mapper.toEntity(event, kafkaTopic, kafkaPartition, kafkaOffset);
        return repository.insertIfAbsent(entity) ? PersistResult.PERSISTED : PersistResult.DUPLICATE;
    }

    public enum PersistResult {
        PERSISTED,
        DUPLICATE
    }
}
