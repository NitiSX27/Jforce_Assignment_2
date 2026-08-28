package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Cart;
import com.Jforce.Assignment2.entity.Cart_items;
import com.Jforce.Assignment2.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
import com.Jforce.Assignment2.dto.CartItemRequest;
import com.Jforce.Assignment2.dto.CartItemResponse;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;

@RestController
@Validated
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItemResponse> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId).stream().map(CartItemResponse::from).toList();
    }

    @PostMapping("/{userId}/items")
    public CartItemResponse addItem(@PathVariable Long userId,
                                    @Valid @RequestBody CartItemRequest request) {
        return CartItemResponse.from(
                cartService.addItemToCart(userId, request.productId(), request.quantity()));
    }

    @PutMapping("/items/{itemId}")
    public CartItemResponse updateItem(@PathVariable Long itemId,
                                       @RequestParam @Positive int quantity) {
        return CartItemResponse.from(cartService.updateItem(itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
    }
}
