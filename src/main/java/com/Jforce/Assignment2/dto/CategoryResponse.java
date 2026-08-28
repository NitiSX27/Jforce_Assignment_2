package com.Jforce.Assignment2.dto;

import com.Jforce.Assignment2.entity.Categories;

public record CategoryResponse(Long id, String name) {
    public static CategoryResponse from(Categories category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
