package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Inventory;
import com.Jforce.Assignment2.repository.InventoryRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }

    public Inventory addInventory(Inventory inventory){
        return inventoryRepository.save(inventory);
    }

    public Inventory getInventoryByProduct(Long productId){
        return inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));
    }

    public Inventory updateQuantity(Long productId, int quantity){
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }

        Inventory inventory = inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        inventory.setQuantity(quantity);
        return inventoryRepository.save(inventory);
    }

    public boolean checkStock(Long productId, int requiredQuantity) {
        if (requiredQuantity < 0) {
            throw new IllegalArgumentException("Required quantity cannot be negative");
        }

        Inventory inventory = getInventoryByProduct(productId);
        return inventory.getQuantity() >= requiredQuantity;
    }

    public Inventory reduceStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Inventory inventory = getInventoryByProduct(productId);

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient inventory");
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        return inventoryRepository.save(inventory);
    }
}
