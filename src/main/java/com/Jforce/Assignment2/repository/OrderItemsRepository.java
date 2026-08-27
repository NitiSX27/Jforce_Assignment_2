package com.Jforce.Assignment2.repository;

import com.Jforce.Assignment2.entity.Order_items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemsRepository extends JpaRepository<Order_items, Long> {

    List<Order_items> findByOrder_Id(Long orderId);
}
