package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Cart;
import com.Jforce.Assignment2.entity.Cart_items;
import com.Jforce.Assignment2.entity.Product;
import com.Jforce.Assignment2.repository.CartItemsRepository;
import com.Jforce.Assignment2.repository.CartRepository;
import com.Jforce.Assignment2.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    private final CartItemsRepository cartItemsRepository;

    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemsRepository cartItemsRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartByUser(Long id){

        return cartRepository.findByUser_Id(id)
                .orElseThrow(() -> new RuntimeException("Cart Not Found"));
    }

    public Cart_items addItemToCart(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Cart cart = getCartByUser(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        Cart_items cartItem = cartItemsRepository
                .findByCart_IdAndProduct_Id(cart.getId(), productId)
                .orElse(new Cart_items());

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(cartItem.getQuantity() + quantity);

        return cartItemsRepository.save(cartItem);
    }

    public Cart_items updateItem(Long itemId, int quantity){

        if(quantity <= 0){
            throw new IllegalArgumentException("Quantity Should Be Greater Than 0");
        }

        Cart_items cartItem = cartItemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item Not Found"));

        cartItem.setQuantity(quantity);

        return cartItemsRepository.save(cartItem);

    }

    public void removeItem(Long itemId){
        Cart_items cartItem = cartItemsRepository.findById(itemId)
                        .orElseThrow(() -> new RuntimeException("Item Not Found"));
        cartItemsRepository.delete(cartItem);
    }

    public List<Cart_items> getCartItems(Long userId) {
        Cart cart = getCartByUser(userId);
        return cartItemsRepository.findByCart_Id(cart.getId());
    }
}
