package com.Jforce.Assignment2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record InventoryRequest(
        @NotNull Long productId,
        @PositiveOrZero int quantity
) {
}
