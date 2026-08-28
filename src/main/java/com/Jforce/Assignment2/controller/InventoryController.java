package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Inventory;
import com.Jforce.Assignment2.dto.InventoryRequest;
import com.Jforce.Assignment2.service.InventoryService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.validation.annotation.Validated;

@RestController
@Validated
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public Inventory addInventory(@Valid @RequestBody InventoryRequest request) {
        return inventoryService.addInventory(request.productId(), request.quantity());
    }

    @GetMapping("/product/{productId}")
    public Inventory getInventory(@PathVariable Long productId) {
        return inventoryService.getInventoryByProduct(productId);
    }

    @PutMapping("/product/{productId}")
    public Inventory updateQuantity(@PathVariable Long productId,
                                    @RequestParam @PositiveOrZero int quantity) {
        return inventoryService.updateQuantity(productId, quantity);
    }
}
