package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.JPAentities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUser_UserId(Long userId);
    List<Order> findByStatus(Order.Status status);
    
    // Time-based filtering queries
    @Query("SELECT o FROM Order o WHERE FUNCTION('YEAR', o.orderDate) = :year AND FUNCTION('MONTH', o.orderDate) = :month")
    List<Order> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // New query method
    @Query("SELECT o FROM Order o WHERE FUNCTION('YEAR', o.orderDate) = :year")
    List<Order> findByYear(@Param("year") int year);
}