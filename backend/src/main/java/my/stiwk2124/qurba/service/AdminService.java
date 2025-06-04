package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        try {
            System.out.println("AdminService: Fetching all orders from database");
            List<Order> orders = orderRepository.findAll();
            System.out.println("AdminService: Successfully retrieved " + orders.size() + " orders from database");
            
            // Force loading of order items and check for nulls
            for (Order order : orders) {
                System.out.println("AdminService: Processing order ID: " + order.getOrderId());
                
                if (order.getUser() == null) {
                    System.err.println("AdminService: Warning: Order " + order.getOrderId() + " has null user");
                }
                
                if (order.getOrderItems() != null) {
                    try {
                        int itemCount = order.getOrderItems().size(); // Force initialization of lazy collection
                        System.out.println("AdminService: Order " + order.getOrderId() + " has " + itemCount + " items");
                    } catch (Exception e) {
                        System.err.println("AdminService: Error loading items for order " + order.getOrderId() + ": " + e.getMessage());
                    }
                } else {
                    System.err.println("AdminService: Warning: Order " + order.getOrderId() + " has null orderItems list");
                }
            }
            return orders;
        } catch (Exception e) {
            System.err.println("AdminService: Error in getAllOrders service method: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
    }
}