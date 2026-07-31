package com.plc.query.history;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class PlcReadingRepository implements PanacheRepository<PlcReadingEntity> {

    public List<PlcReadingEntity> findLatestByTag(String tagName, int limit) {
        return find("tagName = ?1 order by eventTime desc", tagName)
                .page(Page.ofSize(limit))
                .list();
    }

    public List<PlcReadingEntity> findBetween(String tagName, Instant from, Instant to) {
        return find("tagName = ?1 and eventTime between ?2 and ?3 order by eventTime asc",
                tagName, from, to).list();
    }
}
