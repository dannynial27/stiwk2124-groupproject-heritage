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

@RestController
@RequestMapping("/api/checkout")
// Temporarily comment out PreAuthorize for testing
//@PreAuthorize("hasRole('CUSTOMER')")
public class CheckoutController {
    @Autowired
    private OrderService orderService;

    // Temporarily disabled for testing
    private void verifyUserId(Long userId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            if (!user.getUserId().equals(userId)) {
                throw new SecurityException("Unauthorized access to checkout");
            }
        } catch (Exception e) {
            // Log the exception but continue for testing
            System.out.println("User verification bypassed for testing: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Order> checkout(@PathVariable Long userId) {
        // Temporarily commented out for testing
        // verifyUserId(userId);
        
        try {
            Order order = orderService.checkout(userId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}