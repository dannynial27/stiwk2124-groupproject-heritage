package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductService productService;

    // Customer-facing endpoints only
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/filter")
    public List<Product> getProductsByCategory(@RequestParam(required = false) String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/sort")
    public List<Product> getProductsSortedByPrice(@RequestParam(required = false, defaultValue = "") String sortOrder) {
        return productService.getProductsSortedByPrice(sortOrder);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam(required = false) String query) {
        return productService.searchProducts(query);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search-filter-sort")
    public List<Product> findProducts(@RequestParam(required = false) String category,
                                      @RequestParam(required = false) String query,
                                      @RequestParam(required = false, defaultValue = "") String sortOrder) {
        return productService.findProducts(category, query, sortOrder);
    }
    
    // Temporary endpoint to allow product creation without admin role
    // This should be properly secured in production
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            logger.info("Creating product: {}", product.getName());
            Product createdProduct = productService.addProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    
    // Delete product endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            logger.info("Deleting product with ID: {}", id);
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting product with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    
    // Update product endpoint
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            logger.info("Updating product with ID: {}", id);
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            logger.error("Error updating product with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}