package com.plc.persist.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.example.industrial.contracts.model.Quality;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MeaningfulChangeFilterTest {

    private static PlcReadingEvent event(String value) {
        return new PlcReadingEvent("plc-1", "level", "%DB90.DBW4:INT", "Integer",
                value, Instant.EPOCH, Quality.GOOD);
    }

    @Test
    void onlyAcceptsFirstEventAndValueChanges() {
        MeaningfulChangeFilter filter = new MeaningfulChangeFilter();

        PlcReadingEvent first = event("10");
        assertTrue(filter.hasMeaningfulChange(first));

        filter.remember(first);
        assertFalse(filter.hasMeaningfulChange(event("10")));
        assertTrue(filter.hasMeaningfulChange(event("11")));
    }
}
