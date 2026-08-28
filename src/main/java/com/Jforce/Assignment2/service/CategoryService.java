package com.Jforce.Assignment2.service;

import com.Jforce.Assignment2.entity.Categories;
import com.Jforce.Assignment2.repository.CategoriesRepository;
import org.springframework.stereotype.Service;
import com.Jforce.Assignment2.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoriesRepository categoriesRepository;

    public CategoryService(CategoriesRepository categoriesRepository){
        this.categoriesRepository = categoriesRepository;
    }

    public Categories addCategory(Categories category){
        return categoriesRepository.save(category);
    }

    public List<Categories> getAllCategories(){
        return categoriesRepository.findAll();
    }

    public Categories getCategoryById(Long id){
        return categoriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    public Categories getCategoryByName(String name){
        return categoriesRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + name));
    }

    public Categories updateCategory(Long id, Categories category) {
        Categories existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        return categoriesRepository.save(existingCategory);
    }

    public void deleteCategory(Long id) {
        Categories category = getCategoryById(id);
        categoriesRepository.delete(category);
    }
}
