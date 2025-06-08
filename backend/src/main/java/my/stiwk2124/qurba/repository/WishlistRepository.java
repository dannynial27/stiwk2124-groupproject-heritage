package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.JPAentities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUser_UserId(Long userId);
}