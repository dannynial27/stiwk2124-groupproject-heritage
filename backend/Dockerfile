FROM maven:3.9-eclipse-temurin-17-alpine as build
WORKDIR /app
COPY pom.xml .
# Copy Maven wrapper
COPY .mvn .mvn
COPY mvnw .
# Run dependency resolution separately (for better caching)
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src src
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create a proper shell script for waiting - each echo adds a line
RUN echo '#!/bin/sh' > /start.sh \
    && echo 'while ! wget -q --spider --timeout=1 mysql:3306 2>/dev/null; do' >> /start.sh \
    && echo '  echo "Waiting for MySQL..."' >> /start.sh \
    && echo '  sleep 2' >> /start.sh \
    && echo 'done' >> /start.sh \
    && echo 'echo "MySQL is up - starting app"' >> /start.sh \
    && echo 'java -jar /app/app.jar' >> /start.sh \
    && chmod +x /start.sh \
    && apk add --no-cache wget

# Expose the application port
EXPOSE 8080

# Use sh to run our script
ENTRYPOINT ["/start.sh"]