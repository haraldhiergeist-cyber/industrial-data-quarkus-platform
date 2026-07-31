package com.plc.collector.service;

import com.example.industrial.contracts.model.Quality;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlcReadingEventMapperTest {

    @Test
    void mapsRawPlcReadingToContractEvent() {
        Instant now = Instant.parse("2026-07-31T10:00:00Z");
        PlcReadingEventMapper mapper = new PlcReadingEventMapper(Clock.fixed(now, ZoneOffset.UTC));

        var event = mapper.toEvent(new PlcReader.PlcReading(
                "plc-1", "temperature", "%DB90.DBW0:INT", 23));

        assertEquals("plc-1", event.source());
        assertEquals("temperature", event.tagName());
        assertEquals("23", event.valueAsString());
        assertEquals("Integer", event.dataType());
        assertEquals(now, event.timestamp());
        assertEquals(Quality.GOOD, event.quality());
    }
}
