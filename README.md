# User‑Centered Development of a Digital System for a Doggy Daycare

This project presents a digital system designed to support and streamline daily operations

at a doggy daycare. The system is built with a strong user‑centered approach, where the needs of staff,

administrators and dog owners have shaped both the design and functionality.

The application includes a homepage, a login view, and three tailored dashboards,

one for administrators, one for staff, and one for dog owners. Each dashboard is

structured to be intuitive, accessible, and aligned with the specific tasks and responsibilities

of its user group.

The project demonstrates how thoughtful UX design, clear routines, and efficient information handling

can reduce administrative workload, improve communication, and create smoother workflows in a small‑scale

organization. By combining technical development with an understanding of users’ everyday challenges,

the system contributes to a more structured, transparent, and effective operation.

---

## Requirements

To run the project locally, you need:

- **Docker Desktop**

- **Maven**

- **Node.js & npm**

After installing these tools, you can clone the project and start working with it.

---

## Architecture Overview

The application is structured into three main components:

- **Frontend:** Next.js

- **Backend API:** Spring Boot

- **Database:** MySQL (Docker)

---

## Running the Application with Docker

### Start the full application
```bash
docker-compose up --build
```
Then navigate to http://localhost:3000/

### Stop the full application
```bash
docker-compose down
```


*Or start the application manually*

Database:

```bash
docker-compose up mysql
```


Backend:

```bash
cd backend

mvn spring-boot:run
```
or start backend threw BackendApplication.java in Intellij

Frontend:

```bash
cd frontend

npm install

npm run dev
```

## Frontend Routes

## Root url: http://localhost:3000/

| Route                  | Description                                                                                       |
|------------------------|---------------------------------------------------------------------------------------------------|
| `/`                    | Smoke test                                                                                        |
| `/home`                | Doggy daycare home page                                                                           |
| `/login`               | Log In page                                                                                       |
| `/dog-owner-dashboard` | Dog owner dashboard with tabs: schedule, dog info and contact info                                |
| `/staff-dashboard`     | Staff dashboard with day and week vue of shedule as well as check in and out functionality        |
| `/admin-dashboard`     | Admin dashboard with add dog owner, add dogs, edit dog owners and delete dog owners functionality |


---

# API Documentation

Below are the available API endpoints for the DoggyDaycare backend.
All endpoints follow REST conventions and return JSON responses.

---

## **UserController Endpoints (`/api/v1/users`)**

| Method | Endpoint                      | Description |
|--------|-------------------------------|-------------|
| POST   | `/api/v1/users`               | Create a new user |
| GET    | `/api/v1/users`               | Get all users |
| GET    | `/api/v1/users/{id}`          | Get a specific user by ID |
| GET    | `/api/v1/users/{userId}/dogs` | Get all dogs belonging to a specific user |
| PUT    | `/api/v1/users/{id}`          | Update an existing user |
| DELETE | `/api/v1/users/{id}`          | Soft delete a user |

---

## **DogController Endpoints (`/api/v1/dogs`)**

| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| POST   | `/api/v1/dogs`          | Create a new dog |
| GET    | `/api/v1/dogs`          | Get all dogs |
| GET    | `/api/v1/dogs/{id}`     | Get a specific dog by ID |
| PUT    | `/api/v1/dogs/{id}`     | Update an existing dog |
| DELETE | `/api/v1/dogs/{id}`     | Soft delete a dog |

---

## **BookingController Endpoints (`/api/v1/bookings`)**

| Method | Endpoint                              | Description |
|--------|-----------------------------------------|-------------|
| POST   | `/api/v1/bookings`                      | Create a new booking (auto‑confirmed if no conflict) |
| GET    | `/api/v1/bookings`                      | Get all non‑deleted bookings |
| GET    | `/api/v1/bookings/{id}`                 | Get a booking by ID |
| GET    | `/api/v1/bookings/date/{date}`          | Get bookings for a specific date (`YYYY‑MM‑DD`) |
| GET    | `/api/v1/bookings/dog/{dogId}`          | Get bookings for a specific dog |
| GET    | `/api/v1/bookings/user/{userId}`        | Get bookings created by a specific user |
| GET    | `/api/v1/bookings/status/{status}`      | Get bookings by status (`PENDING`, `CONFIRMED`, etc.) |
| PUT    | `/api/v1/bookings/{id}`                 | Partially update a booking (only non‑null fields applied) |
| POST   | `/api/v1/bookings/{id}/check-in`        | Mark a booking as checked in |
| POST   | `/api/v1/bookings/{id}/check-out`       | Mark a booking as checked out |
| POST   | `/api/v1/bookings/{id}/cancel`          | Cancel a booking |
| DELETE | `/api/v1/bookings/{id}`                 | Soft delete a booking |

---

## MySQL:

Port: 3306

Databas: doggydaycare

---
## .env file (optional) add in root IF you want to change the database credentials

DB_USERNAME=root

DB_PASSWORD=rootpassword

## JWT secret for token signing
JWT_SECRET=your-secure-secret-key

---

## Dev data initializer
The backend contains a DevDataInitializer that seeds the database with example users, dogs and bookings
when the application starts in a development environment.

If the initializer finds existing data it will skip seeding (you’ll see a log message like "Dev data already present. Skipping initialization. Use --force to reinitialize.").
Check the application logs for a "Dev data summary" and the sample credentials printed at startup.

Example test accounts to use in log in (seeded by the initializer):

ownerone@doggydaycare.com / ownerone123

ownertwo@doggydaycare.com / ownertwo123

staff@doggydaycare.com / staff123

admin@doggydaycare.com / admin123

(If you need to re-seed, run the backend with the --force argument — e.g. ./mvnw spring-boot:run

-Dspring-boot.run.arguments=--force, java -jar target/*.jar --force, or pass --force to the container — to force the initializer to run again.)

## License

This project was developed as part of an academic assignment and is intended for educational purposes.

© 2026 Emily Pettersson
