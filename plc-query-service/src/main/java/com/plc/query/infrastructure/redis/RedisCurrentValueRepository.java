package com.plc.query.infrastructure.redis;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.query.application.current.CurrentValueRepository;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.keys.KeyCommands;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class RedisCurrentValueRepository implements CurrentValueRepository {

    private static final String KEY_PATTERN = "plc:*";

    private final KeyCommands<String> keyCommands;
    private final ValueCommands<String, PlcReadingEvent> valueCommands;

    public RedisCurrentValueRepository(RedisDataSource dataSource) {
        this.keyCommands = dataSource.key();
        this.valueCommands = dataSource.value(PlcReadingEvent.class);
    }

    @Override
    public Optional<PlcReadingEvent> findByTag(String tag) {
        if (tag.startsWith("plc:")) {
            return Optional.ofNullable(valueCommands.get(tag));
        }
        return keyCommands.keys("plc:*:" + tag).stream()
                .findFirst()
                .map(valueCommands::get);
    }

    @Override
    public void save(String key, PlcReadingEvent reading) {
        valueCommands.set(key, reading);
    }

    @Override
    public List<PlcReadingEvent> findAll() {
        List<String> keys = keyCommands.keys(KEY_PATTERN);
        if (keys.isEmpty()) {
            return List.of();
        }
        return valueCommands.mget(keys.toArray(String[]::new)).values().stream()
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @Override
    public void delete(String tag) {
        List<String> keys = tag.startsWith("plc:")
                ? List.of(tag)
                : keyCommands.keys("plc:*:" + tag);
        if (!keys.isEmpty()) {
            keyCommands.del(keys.toArray(String[]::new));
        }
    }
}
