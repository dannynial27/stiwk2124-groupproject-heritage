package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.JPAentities.WishlistItem;
import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.repository.WishlistRepository;
import my.stiwk2124.qurba.repository.WishlistItemRepository;
import my.stiwk2124.qurba.repository.ProductRepository;
import my.stiwk2124.qurba.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUser_UserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    return wishlistRepository.save(newWishlist);
                });
    }

    @Transactional
    public Wishlist addItemToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<WishlistItem> existingItem = wishlist.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            throw new IllegalStateException("Product is already in wishlist");
        }

        WishlistItem newItem = new WishlistItem();
        newItem.setWishlist(wishlist);
        newItem.setProduct(product);
        wishlist.getItems().add(newItem);

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public Wishlist removeItemFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        wishlist.getItems().removeIf(item ->
                item.getProduct().getProductId().equals(productId));

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void clearWishlist(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
    }

    @Transactional(readOnly = true)
    public boolean isProductInWishlist(Long userId, Long productId) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUser_UserId(userId);

        if (wishlistOpt.isPresent()) {
            return wishlistOpt.get().getItems().stream()
                    .anyMatch(item -> item.getProduct().getProductId().equals(productId));
        }

        return false;
    }

    @Transactional(readOnly = true)
    public int getWishlistItemCount(Long userId) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUser_UserId(userId);

        if (wishlistOpt.isPresent()) {
            return wishlistOpt.get().getItems().size();
        }

        return 0;
    }
}