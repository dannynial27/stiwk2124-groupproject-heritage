package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Cart;
import my.stiwk2124.qurba.JPAentities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUser_UserId(Long userId);
}