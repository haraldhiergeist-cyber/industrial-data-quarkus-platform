package com.plc.persist.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

@Entity
@Table(
        name = "plc_reading",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_kafka_message",
                columnNames = {"kafka_topic", "kafka_partition", "kafka_offset"}))
public class PlcReadingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "source", nullable = false, length = 100)
    public String source;

    @Column(name = "tag_name", nullable = false, length = 100)
    public String tagName;

    @Column(name = "address", nullable = false)
    public String address;

    @Column(name = "data_type", nullable = false, length = 50)
    public String dataType;

    @Column(name = "value_as_string")
    public String valueAsString;

    @Column(name = "event_time", nullable = false)
    public Instant eventTime;

    @Column(name = "quality", nullable = false, length = 50)
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
