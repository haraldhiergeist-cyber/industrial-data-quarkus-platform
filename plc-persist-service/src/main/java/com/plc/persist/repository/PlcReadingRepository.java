package com.plc.persist.repository;

import com.plc.persist.entity.PlcReadingEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class PlcReadingRepository implements PanacheRepository<PlcReadingEntity> {

    private final EntityManager entityManager;

    public PlcReadingRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public boolean insertIfAbsent(PlcReadingEntity entity) {
        int inserted = entityManager.createNativeQuery("""
                INSERT INTO plc_reading (
                    source, tag_name, address, data_type, value_as_string,
                    event_time, quality, received_time,
                    kafka_topic, kafka_partition, kafka_offset
                ) VALUES (
                    :source, :tagName, :address, :dataType, :valueAsString,
                    :eventTime, :quality, :receivedTime,
                    :kafkaTopic, :kafkaPartition, :kafkaOffset
                )
                ON CONFLICT ON CONSTRAINT uk_kafka_message DO NOTHING
                """)
                .setParameter("source", entity.source)
                .setParameter("tagName", entity.tagName)
                .setParameter("address", entity.address)
                .setParameter("dataType", entity.dataType)
                .setParameter("valueAsString", entity.valueAsString)
                .setParameter("eventTime", entity.eventTime)
                .setParameter("quality", entity.quality)
                .setParameter("receivedTime", entity.receivedTime)
                .setParameter("kafkaTopic", entity.kafkaTopic)
                .setParameter("kafkaPartition", entity.kafkaPartition)
                .setParameter("kafkaOffset", entity.kafkaOffset)
                .executeUpdate();
        return inserted == 1;
    }
}
