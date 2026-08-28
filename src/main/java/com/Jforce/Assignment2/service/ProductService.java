package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Product;
import com.Jforce.Assignment2.repository.CategoriesRepository;
import com.Jforce.Assignment2.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.Jforce.Assignment2.exception.ResourceNotFoundException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoriesRepository categoriesRepository;

    public ProductService(ProductRepository productRepository, CategoriesRepository categoriesRepository) {
        this.productRepository = productRepository;
        this.categoriesRepository = categoriesRepository;
    }

    public Product addProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            product.setCategory(categoriesRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: "
                            + product.getCategory().getId())));
        }
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findByEnabledTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));

        return productRepository.findByCategory_IdAndEnabledTrue(categoryId);
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = getProductById(id);

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setEnabled(product.isEnabled());

        if (product.getCategory() != null) {
            existingProduct.setCategory(categoriesRepository.findById(
                            product.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: "
                            + product.getCategory().getId())));
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
