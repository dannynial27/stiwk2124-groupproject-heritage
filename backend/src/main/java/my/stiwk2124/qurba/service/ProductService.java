package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Product;
import my.stiwk2124.qurba.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.File;

@Service
public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ImageService imageService;

    // Existing admin methods
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        try {
            logger.info("Adding new product: {}", product.getName());
            
            // Ensure numeric fields are properly set
            if (product.getPrice() == null) {
                product.setPrice(BigDecimal.ZERO);
            }
            
            if (product.getStockQuantity() == null) {
                product.setStockQuantity(0);
            }
            
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Product name cannot be empty");
            }
            
            if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
                throw new IllegalArgumentException("Product category cannot be empty");
            }
            
            // Ensure image path uses .png extension
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                String imagePath = product.getImagePath();
                if (!imagePath.toLowerCase().endsWith(".png")) {
                    imagePath = imagePath.replaceAll("\\.[^.]+$", ".png");
                    logger.info("Corrected image path to use .png extension: {}", imagePath);
                    product.setImagePath(imagePath);
                }
            }
            
        return productRepository.save(product);
        } catch (Exception e) {
            logger.error("Error adding product: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Product updateProduct(Long id, Product productDetails) {
        try {
            logger.info("Updating product with ID: {}", id);
            
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Check if category has changed
            boolean categoryChanged = !product.getCategory().equals(productDetails.getCategory());
            String oldCategory = product.getCategory();
            String oldName = product.getName();
            String oldImagePath = product.getImagePath();
            
            // Update product details
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice() != null ? productDetails.getPrice() : BigDecimal.ZERO);
        product.setCategory(productDetails.getCategory());
            product.setStockQuantity(productDetails.getStockQuantity() != null ? productDetails.getStockQuantity() : 0);
            
            // Handle image path updates
            if (productDetails.getImagePath() != null && !productDetails.getImagePath().isEmpty()) {
                String imagePath = productDetails.getImagePath();
                // Ensure image path uses .png extension
                if (!imagePath.toLowerCase().endsWith(".png")) {
                    imagePath = imagePath.replaceAll("\\.[^.]+$", ".png");
                    logger.info("Corrected image path to use .png extension: {}", imagePath);
                }
                
                // If category changed, update the image path to reflect the new category
                if (categoryChanged) {
                    logger.info("Category changed from {} to {}. Updating image path.", oldCategory, product.getCategory());
                    
                    // Extract filename from path
                    String filename = extractFilenameFromPath(imagePath);
                    
                    // Create new path with the updated category
                    String newImagePath = "assets/QurbaProductPhoto/" + product.getCategory() + "/" + filename;
                    logger.info("Updating image path from {} to {}", imagePath, newImagePath);
                    
                    // Try to move the actual file
                    try {
                        // Move the image file to the new category folder
                        boolean moved = moveImageFile(oldCategory, product.getCategory(), filename);
                        if (moved) {
                            logger.info("Successfully moved image to new category folder");
                        } else {
                            logger.warn("Failed to move image file, but will update database path anyway");
                        }
                    } catch (Exception e) {
                        logger.error("Error moving image file: {}", e.getMessage(), e);
                        // Continue with product update even if image move fails
                    }
                    
                    // Update the image path in the database regardless of whether the file move succeeded
                    imagePath = newImagePath;
                }
                
                logger.info("Setting image path to: {}", imagePath);
                product.setImagePath(imagePath);
            } else {
                logger.info("No new image path provided, checking if we need to update existing path: {}", product.getImagePath());
                
                // If category changed but no new image path is provided, we still need to update the path
                if (categoryChanged && oldImagePath != null && !oldImagePath.isEmpty()) {
                    String filename = extractFilenameFromPath(oldImagePath);
                    
                    // Create new path with the updated category
                    String newImagePath = "assets/QurbaProductPhoto/" + product.getCategory() + "/" + filename;
                    logger.info("Updating image path from {} to {}", oldImagePath, newImagePath);
                    
                    try {
                        // Move the image file to the new category folder
                        boolean moved = moveImageFile(oldCategory, product.getCategory(), filename);
                        if (moved) {
                            logger.info("Successfully moved image to new category folder");
                        } else {
                            logger.warn("Failed to move image file, but will update database path anyway");
                        }
                    } catch (Exception e) {
                        logger.error("Error moving image file: {}", e.getMessage(), e);
                    }
                    
                    // Update the image path in the database regardless of whether the file move succeeded
                    product.setImagePath(newImagePath);
                }
            }
            
        return productRepository.save(product);
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteProduct(Long id) {
        try {
            logger.info("Deleting product with ID: {}", id);
            
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Delete associated image if it exists
            try {
                if (product.getCategory() != null && product.getName() != null) {
                    logger.info("Attempting to delete image for product: {}", product.getName());
                    imageService.deleteProductImage(product.getCategory(), product.getName());
                }
            } catch (Exception e) {
                // Just log the error but continue with product deletion
                logger.warn("Failed to delete product image: {}", e.getMessage());
            }
            
        productRepository.delete(product);
        } catch (Exception e) {
            logger.error("Error deleting product: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Helper method to extract filename from path
    private String extractFilenameFromPath(String path) {
        if (path == null) return null;
        
        int lastSlashIndex = path.lastIndexOf('/');
        if (lastSlashIndex >= 0 && lastSlashIndex < path.length() - 1) {
            return path.substring(lastSlashIndex + 1);
        }
        return path; // Return the original path if no slash is found
    }
    
    // Helper method to move image file between category folders
    private boolean moveImageFile(String oldCategory, String newCategory, String filename) {
        try {
            // Use ImageService to get normalized category names
            oldCategory = imageService.normalizeCategory(oldCategory);
            newCategory = imageService.normalizeCategory(newCategory);
            
            // Get paths to the image files
            Path sourcePath = imageService.getProductImagePath(oldCategory, filename);
            Path targetPath = imageService.getProductImagePath(newCategory, filename);
            
            // Check if source file exists
            File sourceFile = sourcePath.toFile();
            if (!sourceFile.exists()) {
                logger.warn("Source image file does not exist: {}", sourcePath);
                return false;
            }
            
            // Ensure target directory exists
            Files.createDirectories(targetPath.getParent());
            
            // Move the file
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("Moved image file from {} to {}", sourcePath, targetPath);
            return true;
        } catch (IOException e) {
            logger.error("Error moving image file: {}", e.getMessage(), e);
            return false;
        }
    }

    // New customer-facing methods
    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByCategoryContaining(category);
    }

    public List<Product> getProductsSortedByPrice(String sortOrder) {
        if ("asc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllOrderByPriceAsc();
        } else if ("desc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllOrderByPriceDesc();
        }
        return getAllProducts();
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchByNameOrDescription(query);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> findProducts(String category, String query, String sortOrder) {
        return productRepository.findProducts(category, query, sortOrder);
    }
}