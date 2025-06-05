package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.*;
import my.stiwk2124.qurba.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    public List<Order> getOrderHistory(Long userId) {
        List<Order> orders = orderRepository.findByUser_UserId(userId);
        // Force loading of order items
        for (Order order : orders) {
            if (order.getOrderItems() != null) {
                order.getOrderItems().size(); // Force initialization of lazy collection
            }
        }
        return orders;
    }
    
    public List<Order> getAllOrders() {
        try {
            System.out.println("Fetching all orders from database");
            List<Order> orders = orderRepository.findAll();
            System.out.println("Successfully retrieved " + orders.size() + " orders from database");
            
            // Force loading of order items and check for nulls
            for (Order order : orders) {
                System.out.println("Processing order ID: " + order.getOrderId());
                
                if (order.getUser() == null) {
                    System.err.println("Warning: Order " + order.getOrderId() + " has null user");
                }
                
                if (order.getOrderItems() != null) {
                    try {
                        int itemCount = order.getOrderItems().size(); // Force initialization of lazy collection
                        System.out.println("Order " + order.getOrderId() + " has " + itemCount + " items");
                    } catch (Exception e) {
                        System.err.println("Error loading items for order " + order.getOrderId() + ": " + e.getMessage());
                    }
                } else {
                    System.err.println("Warning: Order " + order.getOrderId() + " has null orderItems list");
                }
            }
            return orders;
        } catch (Exception e) {
            System.err.println("Error in getAllOrders service method: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
    }

    // Legacy checkout method without shipping info (keep for backward compatibility)
    @Transactional
    public Order checkout(Long userId) {
        return checkout(userId, null, null, null, null, null);
    }

    @Transactional
    public Order checkout(Long userId, String shippingName, String shippingAddress, 
                          String shippingCity, String shippingPostalCode, String paymentMethod) {
        Cart cart = cartService.getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout with empty cart");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus(Order.Status.PENDING);
        order.setOrderDate(LocalDateTime.now());
        
        // Set shipping and payment information
        order.setShippingName(shippingName);
        order.setShippingAddress(shippingAddress);
        order.setShippingCity(shippingCity);
        order.setShippingPostalCode(shippingPostalCode);
        order.setPaymentMethod(paymentMethod);
        
        // Initialize the orderItems list
        order.setOrderItems(new ArrayList<>());

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException(
                        String.format("Insufficient stock for product: %s. Available: %d, Requested: %d",
                                product.getName(), product.getStockQuantity(), cartItem.getQuantity())
                );
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            
            // Add the orderItem to the order's list
            order.getOrderItems().add(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productService.updateProduct(product.getProductId(), product);
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(userId);

        return savedOrder;
    }

    public Optional<Order> getOrderById(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        
        // Force loading of order items if order exists
        orderOpt.ifPresent(order -> {
            if (order.getOrderItems() != null) {
                order.getOrderItems().size(); // Force initialization of lazy collection
            }
        });
        
        return orderOpt;
    }
    
    @Transactional
    public Optional<Order> updateOrderStatus(Long orderId, String status) {
        System.out.println("OrderService: Updating order #" + orderId + " status to: " + status);
        
        // Validate the status string before proceeding
        Order.Status newStatus;
        try {
            newStatus = Order.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            System.err.println("OrderService: Invalid status value: " + status);
            throw new IllegalArgumentException("Invalid order status: " + status + ". Valid values are: " + 
                String.join(", ", getValidStatusValues()));
        }
        
        // Get the order and update its status
        Optional<Order> orderOpt = getOrderById(orderId);
        
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            Order.Status oldStatus = order.getStatus();
            
            // Log the status change
            System.out.println("OrderService: Changing order #" + orderId + " status from " + oldStatus + " to " + newStatus);
            
            // Update the status
            order.setStatus(newStatus);
            
            // Save the updated order
            Order savedOrder = orderRepository.save(order);
            System.out.println("OrderService: Successfully updated order #" + orderId + " status to " + savedOrder.getStatus());
            
            return Optional.of(savedOrder);
        } else {
            System.err.println("OrderService: Order not found with ID: " + orderId);
            return Optional.empty();
        }
    }

    /**
     * Helper method to get all valid status values as strings
     */
    private String[] getValidStatusValues() {
        return Arrays.stream(Order.Status.values())
            .map(Enum::name)
            .toArray(String[]::new);
    }
}