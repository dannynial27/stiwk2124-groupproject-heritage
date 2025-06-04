package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.JPAentities.OrderItem;
import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.service.AdminService;
import my.stiwk2124.qurba.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminService adminService;

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
}
