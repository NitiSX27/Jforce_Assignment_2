package com.Jforce.Assignment2.dto;

import com.Jforce.Assignment2.entity.Cart_items;

public record CartItemResponse(
        Long id,
        Long cartId,
        Long productId,
        String productName,
        double productPrice,
        int quantity
) {
    public static CartItemResponse from(Cart_items item) {
        return new CartItemResponse(
                item.getId(),
                item.getCart().getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getQuantity()
        );
    }
}
