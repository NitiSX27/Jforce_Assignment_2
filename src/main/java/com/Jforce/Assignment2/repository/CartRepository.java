package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser_Id(Long userId);
}
