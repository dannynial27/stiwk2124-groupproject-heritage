package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Add these new queries
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Product> findByCategoryContaining(@Param("category") String category);

    @Query("SELECT p FROM Product p ORDER BY p.price ASC")
    List<Product> findAllOrderByPriceAsc();

    @Query("SELECT p FROM Product p ORDER BY p.price DESC")
    List<Product> findAllOrderByPriceDesc();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByNameOrDescription(@Param("query") String query);

    @Query("SELECT p FROM Product p " +
            "WHERE (:category IS NULL OR LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))) " +
            "AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY " +
            "CASE WHEN :sortOrder = 'asc' THEN p.price END ASC, " +
            "CASE WHEN :sortOrder = 'desc' THEN p.price END DESC, " +
            "CASE WHEN :sortOrder = '' OR :sortOrder IS NULL THEN p.productId END ASC")
    List<Product> findProducts(@Param("category") String category,
                               @Param("query") String query,
                               @Param("sortOrder") String sortOrder);
}