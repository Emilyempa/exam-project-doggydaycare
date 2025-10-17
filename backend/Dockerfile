# -------- BUILD STAGE --------
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Copy Maven-wrapper and configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Make Maven-wrapper executable and build app
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port that Spring Boot uses
EXPOSE 8080

# Start command for app
ENTRYPOINT ["java", "-jar", "app.jar"]

