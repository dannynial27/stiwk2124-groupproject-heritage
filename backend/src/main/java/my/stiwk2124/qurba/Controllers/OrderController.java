package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.Security.CustomUserDetails;
import my.stiwk2124.qurba.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
// Temporarily comment out PreAuthorize for testing
//@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {
    @Autowired
    private OrderService orderService;
    
    // Temporarily modified for testing
    private void verifyUserId(Long userId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            if (!user.getUserId().equals(userId)) {
                throw new SecurityException("Unauthorized access to orders");
            }
        } catch (Exception e) {
            // Log the exception but continue for testing
            System.out.println("User verification bypassed for testing: " + e.getMessage());
        }
    }
    
    // Temporarily modified for testing
    private void verifyOrderOwnership(Long orderId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            Optional<Order> order = orderService.getOrderById(orderId);
            if (order.isEmpty() || !order.get().getUser().getUserId().equals(user.getUserId())) {
                throw new SecurityException("Unauthorized access to order");
            }
        } catch (Exception e) {
            // Log the exception but continue for testing
            System.out.println("Order ownership verification bypassed for testing: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable Long userId) {
        // Temporarily commented out for testing
        // verifyUserId(userId);
        
        try {
            System.out.println("Fetching order history for user: " + userId);
            List<Order> orders = orderService.getOrderHistory(userId);
            System.out.println("Found " + orders.size() + " orders");
            
            // Debug: Print order details including items
            for (Order order : orders) {
                System.out.println("Order #" + order.getOrderId() + " - Total: " + order.getTotalAmount() + " - Items: " + 
                    (order.getOrderItems() != null ? order.getOrderItems().size() : 0));
            }
            
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{orderId}/summary")
    public ResponseEntity<Order> getOrderSummary(@PathVariable Long orderId) {
        // Temporarily commented out for testing
        // verifyOrderOwnership(orderId);
        
        try {
            System.out.println("Fetching order summary for order: " + orderId);
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                System.out.println("Found order #" + order.getOrderId() + " - Total: " + order.getTotalAmount() + " - Items: " + 
                    (order.getOrderItems() != null ? order.getOrderItems().size() : 0));
            } else {
                System.out.println("Order not found");
            }
            
            return orderService.getOrderById(orderId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/admin/all")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            System.out.println("Admin fetching all orders");
            List<Order> allOrders = orderService.getAllOrders();
            System.out.println("Found " + allOrders.size() + " total orders");
            
            // Debug: Print each order's details
            for (Order order : allOrders) {
                System.out.println("Order #" + order.getOrderId() + 
                    " - User: " + (order.getUser() != null ? order.getUser().getUserId() : "null") +
                    " - Status: " + order.getStatus() + 
                    " - Total: " + order.getTotalAmount() + 
                    " - Items: " + (order.getOrderItems() != null ? order.getOrderItems().size() : 0));
            }
            
            return ResponseEntity.ok(allOrders);
        } catch (Exception e) {
            System.err.println("Error in getAllOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PatchMapping("/{orderId}/status")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusUpdateRequest request) {
        try {
            System.out.println("Updating order #" + orderId + " status to: " + request.getStatus());
            
            // Validate that the order exists
            Optional<Order> existingOrder = orderService.getOrderById(orderId);
            if (existingOrder.isEmpty()) {
                System.err.println("Order not found: " + orderId);
                return ResponseEntity.status(404).body("Order not found with ID: " + orderId);
            }
            
            // Try to update the status
            try {
                Optional<Order> updatedOrder = orderService.updateOrderStatus(orderId, request.getStatus());
                
                if (updatedOrder.isPresent()) {
                    Order order = updatedOrder.get();
                    System.out.println("Successfully updated order #" + orderId + " status to: " + order.getStatus());
                    return ResponseEntity.ok(order);
                } else {
                    System.err.println("Failed to update order status, order not found after update: " + orderId);
                    return ResponseEntity.status(404).body("Order not found after update");
                }
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid status value: " + request.getStatus() + " - " + e.getMessage());
                return ResponseEntity.status(400).body("Invalid status value: " + request.getStatus() + " - " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error updating order status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating order status: " + e.getMessage());
        }
    }
    
    // Request body class for status updates
    public static class OrderStatusUpdateRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}