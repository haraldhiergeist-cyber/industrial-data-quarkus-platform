package com.plc.collector.service;

import com.plc.collector.config.PlcConfig;
import io.quarkus.logging.Log;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.plc4x.java.api.PlcConnection;
import org.apache.plc4x.java.api.PlcDriverManager;
import org.apache.plc4x.java.api.messages.PlcReadResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
public class PlcReader {

    private final PlcConfig config;
    private PlcConnection connection;

    public PlcReader(PlcConfig config) {
        this.config = config;
    }

    public synchronized List<PlcReading> readAll() throws Exception {
        ensureConnected();

        var builder = connection.readRequestBuilder();
        for (PlcConfig.Tag tag : config.tags()) {
            builder.addTagAddress(tag.name(), tag.address());
        }

        PlcReadResponse response = builder.build().execute().get(5, TimeUnit.SECONDS);
        List<PlcReading> readings = new ArrayList<>(config.tags().size());

        for (PlcConfig.Tag tag : config.tags()) {
            readings.add(new PlcReading(
                    config.source(),
                    tag.name(),
                    tag.address(),
                    response.getObject(tag.name())
            ));
        }
        return readings;
    }

    private void ensureConnected() throws Exception {
        if (connection == null) {
            Log.info("PLC connection is not initialized; creating it");
            connection = newConnection();
            return;
        }

        if (!connection.isConnected()) {
            if (!config.autoReconnect()) {
                throw new IllegalStateException("PLC connection is disconnected and auto reconnect is disabled");
            }
            Log.warn("PLC connection is disconnected; reconnecting");
            disconnect();
            connection = newConnection();
        }
    }

    private PlcConnection newConnection() throws Exception {
        return PlcDriverManager.getDefault()
                .getConnectionManager()
                .getConnection(config.connectionString());
    }

    @PreDestroy
    public synchronized void disconnect() {
        if (connection == null) {
            return;
        }
        try {
            connection.close();
        } catch (Exception exception) {
            Log.debug("Ignoring error while closing PLC connection", exception);
        } finally {
            connection = null;
        }
    }

    public record PlcReading(String source, String tagName, String address, Object value) {
    }
}
