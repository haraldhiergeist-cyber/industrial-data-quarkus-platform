package com.plc.persist.service;

import com.example.industrial.contracts.event.PlcReadingEvent;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@ApplicationScoped
public class MeaningfulChangeFilter {

    private final ConcurrentMap<String, PlcReadingEvent> lastEvents = new ConcurrentHashMap<>();

    public boolean hasMeaningfulChange(PlcReadingEvent event) {
        PlcReadingEvent previous = lastEvents.get(event.tagName());
        return previous == null || !Objects.equals(previous.valueAsString(), event.valueAsString());
    }

    public void remember(PlcReadingEvent event) {
        lastEvents.put(event.tagName(), event);
    }
}
