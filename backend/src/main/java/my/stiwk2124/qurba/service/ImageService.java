package my.stiwk2124.qurba.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import jakarta.annotation.PostConstruct;

@Service
public class ImageService {
    
    // Base directory for product images - updated to work with new Docker volume
    private final String baseDir = "/app/backend/QurbaProductPhoto";
    private Path basePath;
    
    @PostConstruct
    public void init() {
        basePath = Paths.get(baseDir).toAbsolutePath().normalize();
        try {
            // Create directories if they don't exist
            if (!Files.exists(basePath)) {
                Files.createDirectories(basePath);
                System.out.println("Created base directory: " + basePath);
            } else {
                System.out.println("Using existing base directory: " + basePath);
            }
            
            // Create category directories if they don't exist
            createCategoryDirectory("Lain-lain");
            createCategoryDirectory("Madu");
            createCategoryDirectory("Mee");
            createCategoryDirectory("Minuman");
            createCategoryDirectory("Rempah");
            createCategoryDirectory("Sos");
        } catch (IOException e) {
            System.err.println("Error initializing storage locations: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not initialize storage locations", e);
        }
    }
    
    private void createCategoryDirectory(String category) throws IOException {
        Path categoryPath = basePath.resolve(category);
        if (!Files.exists(categoryPath)) {
            Files.createDirectories(categoryPath);
            System.out.println("Created category directory: " + categoryPath);
        }
    }
    
    /**
     * Upload a product image to the appropriate directory
     * 
     * @param file The image file
     * @param category The product category
     * @param productName The product name
     * @param replaceExisting Whether to replace an existing image
     * @param oldCategory The old category (for replacing)
     * @param oldProductName The old product name (for replacing)
     * @return A map containing the file extension and relative image path for database storage
     * @throws IOException If an error occurs during upload
     */
    public UploadResult uploadProductImage(
            MultipartFile file, 
            String category, 
            String productName, 
            boolean replaceExisting,
            String oldCategory,
            String oldProductName) throws IOException {
        
        System.out.println("Starting upload process for " + productName + " in category " + category);
        
        if (file.isEmpty()) {
            System.err.println("Failed to store empty file");
            throw new IOException("Failed to store empty file");
        }
        
        // Get original filename and extract extension
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        System.out.println("Original filename: " + originalFilename + ", extension: " + fileExtension);
        
        // Normalize category and ensure it exists
        category = normalizeCategory(category);
        Path categoryPath = basePath.resolve(category);
        System.out.println("Category path: " + categoryPath);
        
        if (!Files.exists(categoryPath)) {
            System.out.println("Creating category directory: " + categoryPath);
            Files.createDirectories(categoryPath);
        }
        
        // Delete old file if replacing
        if (replaceExisting && oldCategory != null && oldProductName != null) {
            System.out.println("Replacing existing image. Old category: " + oldCategory + ", old product name: " + oldProductName);
            deleteProductImage(oldCategory, oldProductName);
        }
        
        // Set destination file name
        String filename = productName + "." + fileExtension;
        Path destinationFile = categoryPath.resolve(filename);
        System.out.println("Destination file: " + destinationFile);
        
        // Copy file to destination
        try (InputStream inputStream = file.getInputStream()) {
            System.out.println("Copying file to destination...");
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied successfully to: " + destinationFile);
        } catch (IOException e) {
            System.err.println("Failed to store file: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        
        // Return the path in the old format for database storage (for compatibility)
        String oldFormatPath = "assets/QurbaProductPhoto/" + category + "/" + filename;
        System.out.println("Returning old format path for database: " + oldFormatPath);
        
        // Also include the API path in the logs for reference
        String apiPath = "/qurba/api/images/product/" + category + "/" + filename;
        System.out.println("API path would be: " + apiPath);
        
        return new UploadResult(fileExtension, oldFormatPath);
    }
    
    /**
     * Delete a product image
     * 
     * @param category The product category
     * @param productName The product name
     * @return true if deleted, false otherwise
     */
    public boolean deleteProductImage(String category, String productName) {
        category = normalizeCategory(category);
        Path categoryPath = basePath.resolve(category);
        
        // Try to find any file with the product name and any extension
        File categoryDir = categoryPath.toFile();
        if (categoryDir.exists() && categoryDir.isDirectory()) {
            File[] files = categoryDir.listFiles((dir, name) -> 
                name.startsWith(productName + "."));
            
            if (files != null && files.length > 0) {
                for (File file : files) {
                    if (file.delete()) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get the file extension from a filename
     * Always returns 'png' to ensure consistency
     */
    private String getFileExtension(String filename) {
        // Always use png for consistency
        return "png";
    }
    
    /**
     * Normalize a category name to match directory structure
     */
    public String normalizeCategory(String category) {
        category = category.trim();
        
        // Map to known directory names
        switch (category.toLowerCase()) {
            case "madu": return "Madu";
            case "mee": return "Mee";
            case "minuman": return "Minuman";
            case "rempah": return "Rempah";
            case "sos": return "Sos";
            case "lain-lain":
            case "lain lain": return "Lain-lain";
            default: return category; // Keep original if no match
        }
    }
    
    /**
     * Get the path to a product image
     * @param category The product category
     * @param filename The image filename
     * @return The path to the image file
     */
    public Path getProductImagePath(String category, String filename) {
        return basePath.resolve(category).resolve(filename);
    }
    
    /**
     * Get the path to the default product image
     * @return The path to the default image file
     */
    public Path getDefaultImagePath() {
        return basePath.resolve("default-product.png");
    }
    
    /**
     * Class to hold the result of an image upload
     */
    public static class UploadResult {
        private final String extension;
        private final String imagePath;
        
        public UploadResult(String extension, String imagePath) {
            this.extension = extension;
            this.imagePath = imagePath;
        }
        
        public String getExtension() {
            return extension;
        }
        
        public String getImagePath() {
            return imagePath;
        }
    }
} 