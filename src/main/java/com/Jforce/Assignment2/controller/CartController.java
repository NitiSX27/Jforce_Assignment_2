package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Cart;
import com.Jforce.Assignment2.entity.Cart_items;
import com.Jforce.Assignment2.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<Cart_items> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @PostMapping("/{userId}/items")
    public Cart_items addItem(@PathVariable Long userId,
                              @RequestParam Long productId,
                              @RequestParam int quantity) {
        return cartService.addItemToCart(userId, productId, quantity);
    }

    @PutMapping("/items/{itemId}")
    public Cart_items updateItem(@PathVariable Long itemId,
                                 @RequestParam int quantity) {
        return cartService.updateItem(itemId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
    }
}
