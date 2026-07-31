package com.plc.collector.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;

import java.util.List;

@ConfigMapping(prefix = "plc")
public interface PlcConfig {

    String connectionString();

    @WithDefault("plc-simulator-1")
    String source();

    @WithDefault("true")
    boolean autoReconnect();

    List<Tag> tags();

    interface Tag {
        String name();
        String address();
    }
}
