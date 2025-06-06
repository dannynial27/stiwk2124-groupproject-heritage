package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.Security.CustomUserDetails;
import my.stiwk2124.qurba.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("hasRole('CUSTOMER')")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    private void verifyUserId(Long userId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            if (!user.getUserId().equals(userId)) {
                throw new SecurityException("Unauthorized access to wishlist");
            }
        } catch (Exception e) {
            throw new SecurityException("Unauthorized access: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWishlist(@PathVariable Long userId) {
        verifyUserId(userId);

        try {
            Wishlist wishlist = wishlistService.getOrCreateWishlist(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve wishlist: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToWishlist(@PathVariable Long userId, @RequestParam Long productId) {
        verifyUserId(userId);

        try {
            Wishlist wishlist = wishlistService.addItemToWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add item to wishlist: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long userId, @RequestParam Long productId) {
        verifyUserId(userId);

        try {
            Wishlist wishlist = wishlistService.removeItemFromWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove item from wishlist: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearWishlist(@PathVariable Long userId) {
        verifyUserId(userId);

        try {
            wishlistService.clearWishlist(userId);
            Wishlist wishlist = wishlistService.getOrCreateWishlist(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear wishlist: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{userId}/check/{productId}")
    public ResponseEntity<?> checkProductInWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        verifyUserId(userId);

        try {
            boolean isInWishlist = wishlistService.isProductInWishlist(userId, productId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isInWishlist", isInWishlist);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to check wishlist status: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<?> getWishlistItemCount(@PathVariable Long userId) {
        verifyUserId(userId);

        try {
            int count = wishlistService.getWishlistItemCount(userId);
            Map<String, Integer> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get wishlist count: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}