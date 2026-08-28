package com.Jforce.Assignment2.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

public record ProductRequest(
        @NotBlank String name,
        String description,
        @DecimalMin(value = "0.0", inclusive = false) double price,
        boolean enabled,
        Long categoryId
) {
}
