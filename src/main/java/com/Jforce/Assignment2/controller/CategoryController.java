package com.Jforce.Assignment2.controller;

import com.Jforce.Assignment2.entity.Categories;
import com.Jforce.Assignment2.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Categories> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @PostMapping
    public Categories addCategory(@RequestBody Categories category){
        return categoryService.addCategory(category);
    }

    @PutMapping("/{id}")
    public Categories updateCategory(@PathVariable Long id, @RequestBody Categories category){
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
    }

}
