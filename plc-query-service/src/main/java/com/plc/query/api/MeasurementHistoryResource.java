package com.plc.query.api;

import com.plc.query.history.MeasurementHistoryPoint;
import com.plc.query.history.MeasurementHistoryService;
import com.plc.query.history.MeasurementMetric;
import com.plc.query.history.MeasurementRange;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/history/measurements")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "measurement-history-controller")
public class MeasurementHistoryResource {

    private final MeasurementHistoryService service;

    public MeasurementHistoryResource(MeasurementHistoryService service) {
        this.service = service;
    }

    @GET
    @Operation(operationId = "measurements", summary = "Load measurement history")
    @APIResponse(responseCode = "200", description = "History loaded")
    public List<MeasurementHistoryPoint> measurements(
            @QueryParam("metric") MeasurementMetric metric,
            @QueryParam("range") MeasurementRange range) {
        if (metric == null || range == null) {
            throw new jakarta.ws.rs.BadRequestException("Both metric and range are required");
        }
        return service.loadHistory(metric, range);
    }
}
