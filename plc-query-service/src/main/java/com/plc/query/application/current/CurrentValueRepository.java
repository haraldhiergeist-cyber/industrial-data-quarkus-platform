package com.plc.query.application.current;

import com.example.industrial.contracts.event.PlcReadingEvent;

import java.util.List;
import java.util.Optional;

public interface CurrentValueRepository {
    Optional<PlcReadingEvent> findByTag(String tag);
    void save(String key, PlcReadingEvent reading);
    List<PlcReadingEvent> findAll();
    void delete(String tag);

    default String buildRedisKey(String source, String tagName) {
        return "plc:%s:%s".formatted(source, tagName);
    }
}
