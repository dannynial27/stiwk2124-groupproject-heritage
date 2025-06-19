# Group Heritage Backend Documentation

This document outlines the image processing functionality for the frontend and backend, including upload, storage, retrieval, and display processes for product images.

## Table of Contents
1. [Photo Storage Process](#photo-storage-process)
2. [Photo Retrieval Process](#photo-retrieval-process)
3. [Display in Admin and Customer Interfaces](#display-in-admin-and-customer-interfaces)

## Photo Storage Process

### Overview
Handles the upload and storage of product images when adding or updating products in the admin interface.

### Upload Process
- **Frontend Interaction**:
  - The frontend sends the image file to the backend via the `ImageService.uploadProductImage()` method.
  - Images are uploaded through a multipart form request to the `/api/images/upload` endpoint.
  - The request includes:
    - Category
    - Product name
    - Flag indicating whether to replace an existing image

### Backend Storage
- **ImageController**:
  - Receives the upload request and forwards it to the `ImageService`.
- **Physical Storage**:
  - Images are stored in the `/app/backend/QurbaProductPhoto` directory, organized by category subdirectories (e.g., `Madu`, `Mee`, `Minuman`).
  - Filenames are constructed from the product name with a `.png` extension for consistency.
  - The system creates category directories if they don't exist.

### Database Storage
- **Path Storage**:
  - After saving the physical file, the backend returns a path stored in the `imagePath` field of the `Product` entity.
  - Path format: `assets/QurbaProductPhoto/[category]/[productName].png`
  - This path is saved in the `products` table when a product is created or updated.

## Photo Retrieval Process

### Overview
Manages the retrieval of product images for display in admin and customer interfaces, including product lists and carts.

### Backend Endpoint
- **Endpoint**:
  - `/api/images/product/{category}/{filename}` serves product images.
  - Handled by `ImageController.serveProductImage()`.
- **Functionality**:
  - Normalizes the category name, locates the physical file, and serves it with the appropriate content type.
  - Returns a 404 response if the image doesn't exist.
  - A `/api/images/product/default` endpoint serves a default image when no product image is available.

### Frontend Retrieval
- **ImageService Methods**:
  - `getProductImageUrl()`: Builds a URL based on product category and name.
  - `getSafeProductImageUrl()`: Adds error handling to fall back to a default image.
  - `convertToApiUrl()`: Converts database paths to proper API URLs.

### Path Conversion
- **Process**:
  - Converts database path `assets/QurbaProductPhoto/[category]/[productName].png` to API URL `/api/images/product/[category]/[productName].png`.
  - Ensures all image paths use `.png` extension for consistency.

## Display in Admin and Customer Interfaces

### Overview
Describes how product images are displayed across admin and customer interfaces, ensuring consistent handling and fallback to default images.

### Admin Interface
- **Components**:
  - `AdminTableComponent`:
    - Uses `getProductImagePath()` to display product images.
    - Checks `imagePath`, converts to URL, and falls back to default if needed.
  - `ProductFormComponent`:
    - Displays the current image and allows uploading a new one during product editing.

### Customer Interface
- **Components**:
  - `DashboardComponent`:
    - Displays products in a grid with images using `getProductImagePath()`.
  - `OrdersComponent`:
    - Shows product images in customer order history using `getProductImagePath()`.

### Image Path Handling
- **Consistency**:
  - All components use `ImageService` for consistent image path handling.
  - Includes special case mappings for products with unusual capitalization.
  - Displays a default placeholder image if an image cannot be found.