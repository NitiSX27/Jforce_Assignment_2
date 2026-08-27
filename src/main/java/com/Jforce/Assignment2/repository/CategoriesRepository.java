package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {

    Optional<Categories> findByName(String name);
}
