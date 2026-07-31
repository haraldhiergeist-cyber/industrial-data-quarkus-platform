package com.plc.query.application.current;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.example.industrial.contracts.model.Quality;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CurrentValueServiceTest {

    @Test
    void storesAndLoadsReading() {
        InMemoryRepository repository = new InMemoryRepository();
        CurrentValueService service = new CurrentValueService(repository);
        PlcReadingEvent event = new PlcReadingEvent(
                "plc-1", "temperature", "addr", "Integer", "21",
                Instant.EPOCH, Quality.GOOD);

        service.save(event);

        assertEquals(Optional.of(event), service.getLatest("plc:plc-1:temperature"));
        assertEquals(List.of(event), service.getAll());
    }

    private static final class InMemoryRepository implements CurrentValueRepository {
        private final Map<String, PlcReadingEvent> values = new HashMap<>();

        @Override
        public Optional<PlcReadingEvent> findByTag(String tag) {
            return Optional.ofNullable(values.get(tag));
        }

        @Override
        public void save(String key, PlcReadingEvent reading) {
            values.put(key, reading);
        }

        @Override
        public List<PlcReadingEvent> findAll() {
            return List.copyOf(values.values());
        }

        @Override
        public void delete(String tag) {
            values.remove(tag);
        }
    }
}
