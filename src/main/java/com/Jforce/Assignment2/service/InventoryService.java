package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Inventory;
import com.Jforce.Assignment2.repository.InventoryRepository;
import com.Jforce.Assignment2.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.Jforce.Assignment2.exception.BusinessException;
import com.Jforce.Assignment2.exception.ResourceNotFoundException;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryService(InventoryRepository inventoryRepository, ProductRepository productRepository){
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    }

    public Inventory addInventory(Inventory inventory){
        if (inventory.getProduct() == null || inventory.getProduct().getId() == null) {
            throw new BusinessException("A product is required for inventory");
        }
        inventory.setProduct(productRepository.findById(inventory.getProduct().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: "
                        + inventory.getProduct().getId())));
        return inventoryRepository.save(inventory);
    }

    public Inventory getInventoryByProduct(Long productId){
        return inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));
    }

    public Inventory updateQuantity(Long productId, int quantity){
        if (quantity < 0) {
            throw new BusinessException("Quantity cannot be negative");
        }

        Inventory inventory = inventoryRepository.findByProduct_Id(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + productId));

        inventory.setQuantity(quantity);
        return inventoryRepository.save(inventory);
    }

    public boolean checkStock(Long productId, int requiredQuantity) {
        if (requiredQuantity < 0) {
            throw new BusinessException("Required quantity cannot be negative");
        }

        Inventory inventory = getInventoryByProduct(productId);
        return inventory.getQuantity() >= requiredQuantity;
    }

    public Inventory reduceStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new BusinessException("Quantity must be greater than zero");
        }

        Inventory inventory = getInventoryByProduct(productId);

        if (inventory.getQuantity() < quantity) {
            throw new BusinessException("Insufficient inventory for product: " + productId);
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        return inventoryRepository.save(inventory);
    }
}
