package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Cart_items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemsRepository extends JpaRepository<Cart_items, Long> {

    List<Cart_items> findByCart_Id(Long cartId);

    Optional<Cart_items> findByCart_IdAndProduct_Id(Long cartId, Long productId);
}
