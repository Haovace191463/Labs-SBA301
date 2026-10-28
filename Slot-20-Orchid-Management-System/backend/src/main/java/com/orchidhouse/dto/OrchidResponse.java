package com.orchidhouse.dto;

import java.math.BigDecimal;

import com.orchidhouse.model.Orchid;

public record OrchidResponse(
        Long orchidId,
        String orchidName,
        String orchidDescription,
        String orchidUrl,
        BigDecimal price,
        boolean isNatural,
        Long categoryId,
        String categoryName) {

    public static OrchidResponse from(Orchid orchid) {
        return new OrchidResponse(
                orchid.getOrchidId(),
                orchid.getOrchidName(),
                orchid.getOrchidDescription(),
                orchid.getOrchidUrl(),
                orchid.getPrice(),
                orchid.isNatural(),
                orchid.getCategory().getCategoryId(),
                orchid.getCategory().getCategoryName());
    }
}
