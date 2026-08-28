package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory_Id(Long categoryId);

    List<Product> findByCategory_IdAndEnabledTrue(Long categoryId);

    List<Product> findByEnabledTrue();
}
