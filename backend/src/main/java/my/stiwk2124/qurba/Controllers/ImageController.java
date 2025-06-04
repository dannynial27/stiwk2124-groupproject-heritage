package my.stiwk2124.qurba.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;

import my.stiwk2124.qurba.service.ImageService;
import my.stiwk2124.qurba.service.ImageService.UploadResult;
import java.util.HashMap;
import java.util.Map;
import java.io.File;
import java.nio.file.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("productName") String productName,
            @RequestParam(value = "replaceExisting", required = false, defaultValue = "false") boolean replaceExisting,
            @RequestParam(value = "oldCategory", required = false) String oldCategory,
            @RequestParam(value = "oldProductName", required = false) String oldProductName) {
        
        logger.info("Received image upload request: category={}, productName={}, fileSize={}, originalFilename={}",
                category, productName, file.getSize(), file.getOriginalFilename());
        
        try {
            UploadResult result = imageService.uploadProductImage(file, category, productName, replaceExisting, oldCategory, oldProductName);
            
            // Format the normalized category and filename
            String normalizedCategory = imageService.normalizeCategory(category);
            String filename = productName + "." + result.getExtension();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Image uploaded successfully");
            response.put("category", category);
            response.put("productName", productName);
            response.put("extension", result.getExtension());
            
            // Include both path formats in the response
            response.put("imagePath", result.getImagePath()); // Old format for database
            
            // Also include the API URL for frontend use
            String apiUrl = "/qurba/api/images/product/" + normalizedCategory + "/" + filename;
            response.put("imageUrl", apiUrl);
            
            logger.info("Image uploaded successfully: {}", result.getImagePath());
            logger.info("API URL for image: {}", apiUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error uploading image: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteImage(
            @RequestParam("category") String category,
            @RequestParam("productName") String productName) {
        
        logger.info("Received image delete request: category={}, productName={}", category, productName);
        
        try {
            boolean deleted = imageService.deleteProductImage(category, productName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("deleted", deleted);
            response.put("category", category);
            response.put("productName", productName);
            
            logger.info("Image delete result: {}", deleted);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting image: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/product/{category}/{filename:.+}")
    public ResponseEntity<Resource> serveProductImage(
            @PathVariable String category,
            @PathVariable String filename) {
        
        try {
            // Normalize the category
            String normalizedCategory = imageService.normalizeCategory(category);
            
            // Get the file path
            Path imagePath = imageService.getProductImagePath(normalizedCategory, filename);
            File imageFile = imagePath.toFile();
            
            // Check if the file exists
            if (!imageFile.exists()) {
                logger.warn("Image not found: {}/{}", normalizedCategory, filename);
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type
            String contentType = "image/png";
            if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }
            
            // Return the file
            Resource resource = new FileSystemResource(imageFile);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            logger.error("Error serving image: {}/{} - {}", category, filename, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/product/default")
    public ResponseEntity<Resource> serveDefaultImage() {
        try {
            // Get the default image path
            Path defaultImagePath = imageService.getDefaultImagePath();
            File defaultImageFile = defaultImagePath.toFile();
            
            // Check if the file exists
            if (!defaultImageFile.exists()) {
                logger.warn("Default image not found");
                return ResponseEntity.notFound().build();
            }
            
            // Return the file
            Resource resource = new FileSystemResource(defaultImageFile);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
        } catch (Exception e) {
            logger.error("Error serving default image: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 