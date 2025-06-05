package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.JPAentities.OrderItem;
import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.service.AdminService;
import my.stiwk2124.qurba.service.OrderService;
import my.stiwk2124.qurba.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderService orderService;

    // Product Management
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        try {
            System.out.println("Admin controller fetching all orders");
            List<Map<String, Object>> simplifiedOrders = new ArrayList<>();

            // Get all orders from the repository directly
            List<Order> orders = adminService.getAllOrders();
            System.out.println("Found " + orders.size() + " orders in database");

            // Create simplified order objects to avoid lazy loading issues
            for (Order order : orders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("orderId", order.getOrderId());
                orderData.put("status", order.getStatus().toString());
                orderData.put("orderDate", order.getOrderDate());
                orderData.put("totalAmount", order.getTotalAmount());

                // Add user info if available
                if (order.getUser() != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("userId", order.getUser().getUserId());
                    userData.put("username", order.getUser().getUsername());
                    userData.put("email", order.getUser().getEmail());
                    orderData.put("user", userData);
                }

                // Add order items if available
                List<Map<String, Object>> items = new ArrayList<>();
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item != null && item.getProduct() != null) {
                            Map<String, Object> itemData = new HashMap<>();
                            itemData.put("orderItemId", item.getOrderItemId());
                            itemData.put("quantity", item.getQuantity());
                            itemData.put("unitPrice", item.getUnitPrice());

                            // Add product info
                            Map<String, Object> productData = new HashMap<>();
                            Product product = item.getProduct();
                            productData.put("productId", product.getProductId());
                            productData.put("name", product.getName());
                            productData.put("price", product.getPrice());

                            itemData.put("product", productData);
                            items.add(itemData);
                        }
                    }
                }
                orderData.put("orderItems", items);

                simplifiedOrders.add(orderData);
            }

            return ResponseEntity.ok(simplifiedOrders);
        } catch (Exception e) {
            System.err.println("Error in admin getAllOrders: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve orders: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Update order status
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
            System.out.println("Admin updating order #" + orderId + " status to: " + request.getStatus());

            Optional<Order> updatedOrder = orderService.updateOrderStatus(orderId, request.getStatus());

            if (updatedOrder.isPresent()) {
                Order order = updatedOrder.get();
                System.out.println("Successfully updated order #" + orderId + " status to: " + order.getStatus());
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.status(404).body("Order not found with ID: " + orderId);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Invalid status value: " + request.getStatus() + " - " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error updating order status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating order status: " + e.getMessage());
        }
    }

    // Request body class for updating order status
    public static class UpdateOrderStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    @GetMapping("/orders/filter")
    public ResponseEntity<?> getOrdersByStatus(@RequestParam String status) {
        try {
            List<Order> orders = adminService.getOrdersByStatus(status);

            // Create simplified response objects (similar to getAllOrders)
            List<Map<String, Object>> simplifiedOrders = new ArrayList<>();

            for (Order order : orders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("orderId", order.getOrderId());
                orderData.put("status", order.getStatus().toString());
                orderData.put("orderDate", order.getOrderDate());
                orderData.put("totalAmount", order.getTotalAmount());

                // Add user info
                if (order.getUser() != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("userId", order.getUser().getUserId());
                    userData.put("username", order.getUser().getUsername());
                    userData.put("email", order.getUser().getEmail());
                    orderData.put("user", userData);
                }

                // Add order items
                List<Map<String, Object>> items = new ArrayList<>();
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item != null && item.getProduct() != null) {
                            Map<String, Object> itemData = new HashMap<>();
                            itemData.put("orderItemId", item.getOrderItemId());
                            itemData.put("quantity", item.getQuantity());
                            itemData.put("unitPrice", item.getUnitPrice());

                            // Add product info
                            Map<String, Object> productData = new HashMap<>();
                            Product product = item.getProduct();
                            productData.put("productId", product.getProductId());
                            productData.put("name", product.getName());
                            productData.put("price", product.getPrice());

                            itemData.put("product", productData);
                            items.add(itemData);
                        }
                    }
                }
                orderData.put("orderItems", items);
                simplifiedOrders.add(orderData);
            }

            return ResponseEntity.ok(simplifiedOrders);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve orders: " + e.getMessage());
            return ResponseEntity.status(500).body(error);

        }
    }

    @GetMapping("/orders/by-month")
    public ResponseEntity<?> getOrdersByMonth(
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {

        try {
            List<Order> orders = adminService.getOrdersByYearAndMonth(year, month);

            // Create simplified response objects
            List<Map<String, Object>> simplifiedOrders = new ArrayList<>();

            for (Order order : orders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("orderId", order.getOrderId());
                orderData.put("status", order.getStatus().toString());
                orderData.put("orderDate", order.getOrderDate());
                orderData.put("totalAmount", order.getTotalAmount());

                // Add user info
                if (order.getUser() != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("userId", order.getUser().getUserId());
                    userData.put("username", order.getUser().getUsername());
                    userData.put("email", order.getUser().getEmail());
                    orderData.put("user", userData);
                }

                // Add order items
                List<Map<String, Object>> items = new ArrayList<>();
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item != null && item.getProduct() != null) {
                            Map<String, Object> itemData = new HashMap<>();
                            itemData.put("orderItemId", item.getOrderItemId());
                            itemData.put("quantity", item.getQuantity());
                            itemData.put("unitPrice", item.getUnitPrice());

                            // Add product info
                            Map<String, Object> productData = new HashMap<>();
                            Product product = item.getProduct();
                            productData.put("productId", product.getProductId());
                            productData.put("name", product.getName());
                            productData.put("price", product.getPrice());

                            itemData.put("product", productData);
                            items.add(itemData);
                        }
                    }
                }
                orderData.put("orderItems", items);
                simplifiedOrders.add(orderData);
            }

            return ResponseEntity.ok(simplifiedOrders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve orders: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/orders/by-date-range")
    public ResponseEntity<?> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        try {
            List<Order> orders = adminService.getOrdersByDateRange(startDate, endDate);

            // Create simplified response objects (reuse the same format as above)
            List<Map<String, Object>> simplifiedOrders = new ArrayList<>();

            for (Order order : orders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("orderId", order.getOrderId());
                orderData.put("status", order.getStatus().toString());
                orderData.put("orderDate", order.getOrderDate());
                orderData.put("totalAmount", order.getTotalAmount());

                // Add user info
                if (order.getUser() != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("userId", order.getUser().getUserId());
                    userData.put("username", order.getUser().getUsername());
                    userData.put("email", order.getUser().getEmail());
                    orderData.put("user", userData);
                }

                // Add order items
                List<Map<String, Object>> items = new ArrayList<>();
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item != null && item.getProduct() != null) {
                            Map<String, Object> itemData = new HashMap<>();
                            itemData.put("orderItemId", item.getOrderItemId());
                            itemData.put("quantity", item.getQuantity());
                            itemData.put("unitPrice", item.getUnitPrice());

                            // Add product info
                            Map<String, Object> productData = new HashMap<>();
                            Product product = item.getProduct();
                            productData.put("productId", product.getProductId());
                            productData.put("name", product.getName());
                            productData.put("price", product.getPrice());

                            itemData.put("product", productData);
                            items.add(itemData);
                        }
                    }
                }
                orderData.put("orderItems", items);
                simplifiedOrders.add(orderData);
            }

            return ResponseEntity.ok(simplifiedOrders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve orders: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testAdminAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("username", auth.getName());
        response.put("authorities", auth.getAuthorities().toString());
        response.put("isAuthenticated", auth.isAuthenticated());
        return ResponseEntity.ok(response);
    }
}
