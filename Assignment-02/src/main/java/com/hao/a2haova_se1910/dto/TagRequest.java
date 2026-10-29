package com.hao.a2haova_se1910.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TagRequest(
        Integer id,

        @NotBlank(message = "Tag name is required")
        @Size(max = 50, message = "Tag name must not exceed 50 characters")
        String tagName,

        @Size(max = 400, message = "Note must not exceed 400 characters")
        String note
) {
}

