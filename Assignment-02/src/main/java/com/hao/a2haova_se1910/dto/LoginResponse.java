package com.hao.a2haova_se1910.dto;

public record LoginResponse(
        Short accountId,
        String accountName,
        String accountEmail,
        Integer accountRole,
        String token
) {
}

