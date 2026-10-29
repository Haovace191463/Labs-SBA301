package com.hao.a2haova_se1910.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank(message = "Account name is required")
        @Size(max = 100, message = "Account name must not exceed 100 characters")
        String accountName,

        @NotBlank(message = "Account email is required")
        @Email(message = "Account email must be a valid email address")
        @Size(max = 70, message = "Account email must not exceed 70 characters")
        String accountEmail,

        @Size(max = 70, message = "Password must not exceed 70 characters")
        String accountPassword
) {
}

