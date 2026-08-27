package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Inventory;
import com.Jforce.Assignment2.service.InventoryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryService.addInventory(inventory);
    }

    @GetMapping("/product/{productId}")
    public Inventory getInventory(@PathVariable Long productId) {
        return inventoryService.getInventoryByProduct(productId);
    }

    @PutMapping("/product/{productId}")
    public Inventory updateQuantity(@PathVariable Long productId, @RequestParam int quantity) {
        return inventoryService.updateQuantity(productId, quantity);
    }
}
