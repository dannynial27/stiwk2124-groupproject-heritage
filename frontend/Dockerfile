# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build
# Add extensive debug for build output structure
RUN ls -la dist
RUN find dist -type d | sort
RUN find dist -type f | sort

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# Copy built assets from build stage
# Copy entire directory contents instead of using wildcards
COPY --from=build /app/dist/temp-project/browser/ /usr/share/nginx/html/

# Show what was copied for debugging
RUN ls -la /usr/share/nginx/html/

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]