package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);
}
