package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Product;
import com.Jforce.Assignment2.repository.CategoriesRepository;
import com.Jforce.Assignment2.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoriesRepository categoriesRepository;

    public ProductService(ProductRepository productRepository, CategoriesRepository categoriesRepository) {
        this.productRepository = productRepository;
        this.categoriesRepository = categoriesRepository;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return productRepository.findByCategory_Id(categoryId);
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
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
