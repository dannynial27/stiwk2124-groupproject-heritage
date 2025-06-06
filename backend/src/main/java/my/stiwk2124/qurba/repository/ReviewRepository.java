package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Review;
import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.JPAentities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);
    List<Review> findByProduct_ProductId(Long productId);
    List<Review> findByUser(User user);
    List<Review> findByUser_UserId(Long userId);
    Optional<Review> findByUserAndProduct(User user, Product product);
    Optional<Review> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    Long getReviewCountByProductId(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r WHERE r.product.productId = :productId ORDER BY r.createdAt DESC")
    List<Review> findByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r WHERE r.product.productId = :productId AND r.rating = :rating ORDER BY r.createdAt DESC")
    List<Review> findByProductIdAndRating(@Param("productId") Long productId, @Param("rating") Integer rating);
}