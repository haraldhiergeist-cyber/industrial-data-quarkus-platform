package com.plc.persist.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.example.industrial.contracts.model.Quality;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlcReadingMapperTest {

    @Test
    void mapsEventAndKafkaMetadata() {
        Instant receivedAt = Instant.parse("2026-07-31T10:01:00Z");
        Instant eventAt = Instant.parse("2026-07-31T10:00:00Z");
        PlcReadingMapper mapper = new PlcReadingMapper(Clock.fixed(receivedAt, ZoneOffset.UTC));
        PlcReadingEvent event = new PlcReadingEvent(
                "plc-1", "pressure", "%DB90.DBW2:INT", "Integer", "8",
                eventAt, Quality.GOOD);

        var entity = mapper.toEntity(event, "plc.raw.readings", 2, 42L);

        assertEquals("pressure", entity.tagName);
        assertEquals(eventAt, entity.eventTime);
        assertEquals(receivedAt, entity.receivedTime);
        assertEquals(2, entity.kafkaPartition);
        assertEquals(42L, entity.kafkaOffset);
    }
}
