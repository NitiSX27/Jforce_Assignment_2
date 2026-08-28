package com.Jforce.Assignment2.dto;

import com.Jforce.Assignment2.entity.Product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        double price,
        boolean enabled,
        int inventoryQuantity,
        Long categoryId,
        String categoryName
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.isEnabled(),
                product.getInventory() == null ? 0 : product.getInventory().getQuantity(),
                product.getCategory() == null ? null : product.getCategory().getId(),
                product.getCategory() == null ? null : product.getCategory().getName()
        );
    }
}
