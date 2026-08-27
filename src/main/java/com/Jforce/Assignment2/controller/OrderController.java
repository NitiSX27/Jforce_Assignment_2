package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Order;
import com.Jforce.Assignment2.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout/{userId}")
    public Order placeOrder(@PathVariable Long userId, @RequestParam Long addressId) {
        return orderService.placeOrder(userId, addressId);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
