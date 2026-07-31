package com.plc.persist.kafka;

import com.example.industrial.contracts.event.PlcReadingEvent;
import io.quarkus.kafka.client.serialization.ObjectMapperDeserializer;

public class PlcReadingEventDeserializer extends ObjectMapperDeserializer<PlcReadingEvent> {
    public PlcReadingEventDeserializer() {
        super(PlcReadingEvent.class);
    }
}
