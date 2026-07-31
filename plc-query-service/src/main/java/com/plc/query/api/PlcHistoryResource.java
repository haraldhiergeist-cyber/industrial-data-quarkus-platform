package com.plc.query.api;

import com.example.industrial.contracts.historic.HistoryPoint;
import com.plc.query.history.PlcHistoryService;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/history/temperature")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "plc-history-controller")
public class PlcHistoryResource {

    private final PlcHistoryService service;

    public PlcHistoryResource(PlcHistoryService service) {
        this.service = service;
    }

    @GET
    @Operation(operationId = "temperature")
    public List<HistoryPoint> temperature() {
        return service.getTemperatureHistory();
    }
}
