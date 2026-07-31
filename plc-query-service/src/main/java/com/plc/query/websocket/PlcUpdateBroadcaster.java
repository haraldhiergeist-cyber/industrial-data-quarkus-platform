package com.plc.query.websocket;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.logging.Log;
import io.quarkus.websockets.next.OpenConnections;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PlcUpdateBroadcaster {

    private final OpenConnections openConnections;
    private final ObjectMapper objectMapper;

    public PlcUpdateBroadcaster(OpenConnections openConnections, ObjectMapper objectMapper) {
        this.openConnections = openConnections;
        this.objectMapper = objectMapper;
    }

    public void broadcast(PlcReadingEvent event) {
        final String json;
        try {
            json = objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize PLC update", exception);
        }

        openConnections.listAll().forEach(connection ->
                connection.sendText(json).subscribe().with(
                        ignored -> { },
                        failure -> Log.debugf(failure,
                                "Unable to send PLC update to WebSocket %s", connection.id())));
    }
}
