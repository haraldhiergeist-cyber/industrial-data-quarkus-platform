package com.plc.query.kafka;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.query.application.current.PlcStateUpdateService;
import io.smallrye.reactive.messaging.annotations.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Incoming;

@ApplicationScoped
public class PlcReadingConsumer {

    private final PlcStateUpdateService stateUpdateService;

    public PlcReadingConsumer(PlcStateUpdateService stateUpdateService) {
        this.stateUpdateService = stateUpdateService;
    }

    @Incoming("plc-readings-in")
    @Blocking
    void consume(PlcReadingEvent event) {
        stateUpdateService.handleIncomingReading(event);
    }
}
