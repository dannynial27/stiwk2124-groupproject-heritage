package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Review;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.Security.CustomUserDetails;
import my.stiwk2124.qurba.dto.ReviewRequest;
import my.stiwk2124.qurba.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    private void verifyUserId(Long userId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            if (!user.getUserId().equals(userId)) {
                throw new SecurityException("Unauthorized access to reviews");
            }
        } catch (Exception e) {
            throw new SecurityException("Unauthorized access: " + e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        try {
            List<Review> reviews = reviewService.getProductReviews(productId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve reviews: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<?> getProductReviewStats(@PathVariable Long productId) {
        try {
            Map<String, Object> stats = reviewService.getProductReviewStats(productId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve review stats: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/product/{productId}/rating/{rating}")
    public ResponseEntity<?> getProductReviewsByRating(@PathVariable Long productId, @PathVariable Integer rating) {
        try {
            List<Review> reviews = reviewService.getProductReviewsByRating(productId, rating);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve reviews: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addReview(@PathVariable Long userId, @RequestBody ReviewRequest request) {
        verifyUserId(userId);

        try {
            Review review = reviewService.addReview(userId, request.getProductId(), request.getRating(), request.getComment());
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException | IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add review: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{userId}/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updateReview(@PathVariable Long userId, @PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        verifyUserId(userId);

        try {
            Review review = reviewService.updateReview(reviewId, userId, request.getRating(), request.getComment());
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(403).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update review: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/{userId}/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> deleteReview(@PathVariable Long userId, @PathVariable Long reviewId) {
        verifyUserId(userId);

        try {
            boolean deleted = reviewService.deleteReview(reviewId, userId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Review not found or unauthorized");
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete review: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
        verifyUserId(userId);

        try {
            List<Review> reviews = reviewService.getUserReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve user reviews: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{userId}/product/{productId}/check")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> checkUserReview(@PathVariable Long userId, @PathVariable Long productId) {
        verifyUserId(userId);

        try {
            boolean hasReviewed = reviewService.hasUserReviewedProduct(userId, productId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasReviewed", hasReviewed);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to check review status: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}