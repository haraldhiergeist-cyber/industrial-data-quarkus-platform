package com.plc.query.api;

import com.example.industrial.contracts.event.PlcReadingEvent;
import com.plc.query.application.current.CurrentValueService;
import com.plc.query.application.current.PlcStateUpdateService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/plc")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "plc-query-controller")
public class PlcQueryResource {

    private final CurrentValueService currentValueService;
    private final PlcStateUpdateService stateUpdateService;

    public PlcQueryResource(CurrentValueService currentValueService, PlcStateUpdateService stateUpdateService) {
        this.currentValueService = currentValueService;
        this.stateUpdateService = stateUpdateService;
    }

    @GET
    @Path("/{tag}")
    @Operation(operationId = "get")
    public Response get(@PathParam("tag") String tag) {
        return currentValueService.getLatest(tag)
                .map(reading -> Response.ok(reading).build())
                .orElseGet(() -> Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    @Operation(operationId = "set")
    public PlcReadingEvent set(PlcReadingEvent reading) {
        return stateUpdateService.handleIncomingReading(reading);
    }

    @GET
    @Operation(operationId = "getAll")
    public List<PlcReadingEvent> getAll() {
        return currentValueService.getAll();
    }

    @DELETE
    @Path("/{tag}")
    @Operation(operationId = "delete")
    public Response delete(@PathParam("tag") String tag) {
        currentValueService.delete(tag);
        return Response.noContent().build();
    }
}
