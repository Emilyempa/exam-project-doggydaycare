# DoggyDaycare – Fullstack Application

DoggyDaycare is a fullstack web application built as a project assignment.

The system supports core workflows for a dog daycare, including management of

dogs, owners, staff roles, and bookings.

The application consists of a Next.js frontend, a Spring Boot backend,

and a MySQL database running in Docker.

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

## Stop application via Docker
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
mvn spring-boot:run
```

Frontend:

```bash
cd frontend

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

# 🐾 API Documentation

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

## License

This project was developed as part of an academic assignment and is intended for educational purposes.

© 2026 Emily Pettersson
