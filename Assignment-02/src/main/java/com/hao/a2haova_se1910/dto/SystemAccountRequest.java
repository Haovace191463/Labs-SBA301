package com.hao.a2haova_se1910.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SystemAccountRequest(
        Short id,

        @NotBlank(message = "Account name is required")
        @Size(max = 100, message = "Account name must not exceed 100 characters")
        String accountName,

        @NotBlank(message = "Account email is required")
        @Email(message = "Account email must be a valid email address")
        @Size(max = 70, message = "Account email must not exceed 70 characters")
        String accountEmail,

        @NotNull(message = "Account role is required (1: Admin, 2: Staff)")
        Integer accountRole,

        @Size(max = 70, message = "Password must not exceed 70 characters")
        String accountPassword
) {
}

