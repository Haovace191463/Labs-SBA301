package com.hao.a2haova_se1910.dto;

import com.hao.a2haova_se1910.entity.SystemAccount;

public record SystemAccountResponse(
        Short id,
        String accountName,
        String accountEmail,
        Integer accountRole
) {
    public static SystemAccountResponse from(SystemAccount account) {
        if (account == null) return null;
        return new SystemAccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );
    }
}

