package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Categories;
import com.Jforce.Assignment2.service.CategoryService;
import com.Jforce.Assignment2.dto.CategoryRequest;
import com.Jforce.Assignment2.dto.CategoryResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories(){
        return categoryService.getAllCategories().stream().map(CategoryResponse::from).toList();
    }

    @PostMapping
    public CategoryResponse addCategory(@Valid @RequestBody CategoryRequest request){
        return CategoryResponse.from(categoryService.addCategory(new Categories(null, request.name())));
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request){
        return CategoryResponse.from(categoryService.updateCategory(id, new Categories(null, request.name())));
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
    }

}
