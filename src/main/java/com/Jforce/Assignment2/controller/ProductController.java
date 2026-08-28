package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Product;
import com.Jforce.Assignment2.service.ProductService;
import com.Jforce.Assignment2.dto.ProductRequest;
import com.Jforce.Assignment2.dto.ProductResponse;
import com.Jforce.Assignment2.entity.Categories;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts().stream().map(ProductResponse::from).toList();
    }

    @GetMapping("/admin")
    public List<ProductResponse> getAllProductsForAdmin(){
        return productService.getAllProductsForAdmin().stream().map(ProductResponse::from).toList();
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getProductsByCategory(@PathVariable Long categoryId){
        return productService.getProductsByCategory(categoryId).stream().map(ProductResponse::from).toList();
    }

    @PostMapping
    public ProductResponse addProduct(@Valid @RequestBody ProductRequest request) {
        return ProductResponse.from(productService.addProduct(toEntity(request)));
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ProductResponse.from(productService.updateProduct(id, toEntity(request)));
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    private Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setEnabled(request.enabled());
        if (request.categoryId() != null) {
            Categories category = new Categories();
            category.setId(request.categoryId());
            product.setCategory(category);
        }
        return product;
    }
}
