package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.*;
import com.Jforce.Assignment2.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderItemsRepository orderItemsRepository;

    private final OrderRepository orderRepository;

    private final CartRepository cartRepository;

    private final CartItemsRepository cartItemsRepository;

    private final UserRepository userRepository;

    private final AddressRepository addressRepository;

    private final InventoryService inventoryService;

    public OrderService(OrderItemsRepository orderItemsRepository, OrderRepository orderRepository, CartRepository cartRepository, CartItemsRepository cartItemsRepository, UserRepository userRepository, AddressRepository addressRepository, InventoryService inventoryService) {
        this.orderItemsRepository = orderItemsRepository;
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public Order placeOrder(Long userId, Long addressId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address Not Found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Address does not belong to user");
        }

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart Not Found"));

        List<Cart_items> cartItems = cartItemsRepository.findByCart_Id(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;

        for (Cart_items cartItem : cartItems) {
            if (!inventoryService.checkStock(
                    cartItem.getProduct().getId(), cartItem.getQuantity())) {
                throw new RuntimeException("Insufficient inventory");
            }

            totalAmount += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setStatus("PLACED");
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        for (Cart_items cartItem : cartItems) {
            Order_items orderItem = new Order_items();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItemsRepository.save(orderItem);

            inventoryService.reduceStock(
                    cartItem.getProduct().getId(), cartItem.getQuantity());
            cartItemsRepository.delete(cartItem);
        }

        return order;
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));
    }

    public List<Order> getOrdersByUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return orderRepository.findByUser_Id(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
