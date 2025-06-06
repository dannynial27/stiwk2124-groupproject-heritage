package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Review;
import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.repository.ReviewRepository;
import my.stiwk2124.qurba.repository.ProductRepository;
import my.stiwk2124.qurba.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProductReviewStats(Long productId) {
        Map<String, Object> stats = new HashMap<>();
        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.getReviewCountByProductId(productId);
        stats.put("averageRating", averageRating != null ? Math.round(averageRating * 100.0) / 100.0 : 0.0);
        stats.put("reviewCount", reviewCount != null ? reviewCount : 0);
        return stats;
    }

    @Transactional
    public Review addReview(Long userId, Long productId, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Review> existingReview = reviewRepository.findByUserAndProduct(user, product);
        if (existingReview.isPresent()) {
            throw new IllegalStateException("User has already reviewed this product");
        }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(Long reviewId, Long userId, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUserId().equals(userId)) {
            throw new SecurityException("User can only update their own reviews");
        }

        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    @Transactional
    public boolean deleteReview(Long reviewId, Long userId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);

        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            if (review.getUser().getUserId().equals(userId)) {
                reviewRepository.delete(review);
                return true;
            }
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUser_UserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserReviewedProduct(Long userId, Long productId) {
        return reviewRepository.findByUser_UserIdAndProduct_ProductId(userId, productId).isPresent();
    }

    @Transactional(readOnly = true)
    public List<Review> getProductReviewsByRating(Long productId, Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        return reviewRepository.findByProductIdAndRating(productId, rating);
    }
}