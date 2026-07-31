package com.plc.query.history;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "plc_reading")
public class PlcReadingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "source", nullable = false)
    public String source;

    @Column(name = "tag_name", nullable = false)
    public String tagName;

    @Column(name = "address", nullable = false)
    public String address;

    @Column(name = "data_type", nullable = false)
    public String dataType;

    @Column(name = "value_as_string")
    public String valueAsString;

    @Column(name = "event_time", nullable = false)
    public Instant eventTime;

    @Column(name = "quality", nullable = false)
    public String quality;

    @Column(name = "received_time", nullable = false)
    public Instant receivedTime;

    @Column(name = "kafka_topic")
    public String kafkaTopic;

    @Column(name = "kafka_partition")
    public Integer kafkaPartition;

    @Column(name = "kafka_offset")
    public Long kafkaOffset;
}
