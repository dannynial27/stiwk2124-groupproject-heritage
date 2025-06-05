package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Feedback;
import my.stiwk2124.qurba.JPAentities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUser(User user);
    
    List<Feedback> findByUser_UserId(Long userId);
    
    // Time-based filtering queries
    @Query("SELECT f FROM Feedback f WHERE FUNCTION('YEAR', f.createdAt) = :year AND FUNCTION('MONTH', f.createdAt) = :month")
    List<Feedback> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT f FROM Feedback f WHERE FUNCTION('YEAR', f.createdAt) = :year")
    List<Feedback> findByYear(@Param("year") int year);
    
    @Query("SELECT f FROM Feedback f ORDER BY f.createdAt DESC")
    List<Feedback> findAllOrderedByCreatedAtDesc();
}