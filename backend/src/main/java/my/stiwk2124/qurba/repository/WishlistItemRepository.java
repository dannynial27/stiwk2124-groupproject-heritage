package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.WishlistItem;
import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.JPAentities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByWishlist(Wishlist wishlist);
    Optional<WishlistItem> findByWishlistAndProduct(Wishlist wishlist, Product product);
    Optional<WishlistItem> findByWishlist_User_UserIdAndProduct_ProductId(Long userId, Long productId);
    void deleteByWishlist(Wishlist wishlist);
}