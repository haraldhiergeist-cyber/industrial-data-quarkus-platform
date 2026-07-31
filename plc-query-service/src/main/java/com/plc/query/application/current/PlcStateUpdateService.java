package com.plc.query.application.current;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.query.websocket.PlcUpdateBroadcaster;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Objects;
import java.util.Optional;

@ApplicationScoped
public class PlcStateUpdateService {

    private final CurrentValueRepository repository;
    private final PlcUpdateBroadcaster broadcaster;

    public PlcStateUpdateService(CurrentValueRepository repository, PlcUpdateBroadcaster broadcaster) {
        this.repository = repository;
        this.broadcaster = broadcaster;
    }

    public PlcReadingEvent handleIncomingReading(PlcReadingEvent event) {
        String redisKey = repository.buildRedisKey(event.source(), event.tagName());
        Optional<PlcReadingEvent> existing = repository.findByTag(redisKey);

        boolean shouldPublish = existing.isEmpty()
                || !Objects.equals(existing.get().valueAsString(), event.valueAsString());

        if (shouldPublish) {
            repository.save(redisKey, event);
            broadcaster.broadcast(event);
        }
        return event;
    }
}
