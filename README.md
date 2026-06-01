# Movie Ticketing System - Frontend

A modern, type-safe, highly interactive movie ticketing web application featuring real-time seat reservations, session holding logic, dynamic cinema/movie catalog filtering, and a powerful administrative backend portal.

The application is built using a mobile-first design, ensuring premium responsiveness and usability across all screen sizes, from small mobile viewports to large desktop monitors.

---

## Core Strengths

* **Mobile-First & Adaptive Design:** Custom fluid grids and responsive components adapt ideally to viewports ranging from small mobiles (under 400px) to ultra-wide displays. Incorporates swipeable horizontal lists and sticky navigation headers to optimize mobile interaction.
* **Precise Reservation State Protection:** Implements transactional safety for seat reservations. Selecting seats locks them with a 5-minute session countdown timer, preventing double bookings. Direct basket manipulations are disabled to prevent seat and checkout ticket mismatches.
* **High Performance Caching:** Utilizes TanStack React Query v5 for asynchronous server state management. Features automatic caching, background refetching, and state synchronization.
* **Rigorous Type Safety:** Leverages TypeScript, Zod, and React Hook Form to enforce type safety and runtime schema validations across all forms, requests, and state definitions.

---

## Frontend Technology Stack

* **React 19:** Component-based UI rendering.
* **TypeScript:** Static type verification.
* **Vite 8:** Next-generation build tool and fast HMR server.
* **Tailwind CSS v4:** Utility-first CSS variables styling engine.
* **React Router v7:** Modern single-page application routing, layout nesting, and stateful navigation.
* **TanStack React Query v5:** Server state caching, synchronizations, and asynchronous mutation lifecycles.
* **Zustand v5:** High-performance, lightweight client-side state management for user authentication sessions.
* **React Hook Form & Zod:** High-performance form state control with schema validation.
* **Lucide React:** Modern, lightweight SVG vector icon pack.

---

## Project Structure & Views

### User Portal

* **Home (`/` & `/coming-soon`):** Interactive lists of "Now Showing" and "Coming Soon" movies, displaying details, formatting tags, and responsive swipe controls.
* **Cinemas (`/cinemas`):** Unified cinemas directory offering format selection and city-based filtering.
* **Movie Catalog (`/movies`):** Searchable list of all movies, complete with query filters and search bars.
* **Movie Detail (`/movie/:id`):** Displays cinematic details, synopsis, duration, ratings, and showtimes sorted by date and screening formats.
* **Seat Selection (`/movie/:id/seats`):** Visual seat selection grid displaying occupied, selected, and available seats, coupled with a 5-minute lock timer.
* **Ticket Basket (`/basket`):** Shopping basket showing reserved tickets with active countdown timers. Features checkout workflows with validation schemas.

### Admin Portal (Protected)

* **Admin Dashboard (`/admin`):** Analytical dashboard providing overview metrics for administrators.
* **Movie Management (`/admin/movies-management`):** Tables to list, create, edit, or delete movie catalog items.
* **Showtime Creator (`/admin/movies-management/:id/showtime/create`):** Admin scheduler to set up screening times, screens, formats, and pricing structures.
* **Theater Management (`/admin/theaters-management`):** Hall structure managers to set up total rows, seats per row, and screens.
* **Genre Settings (`/admin/genres`):** Reordered, mobile-optimized creation form and list management for movie genres.

---

## Backend Infrastructure (Architecture Overview)

The frontend communicates with a containerized, event-driven microservices backend designed with a focus on high throughput and decoupling.

* **API Gateway & Microservices:** Microservices are built using Python with FastAPI and asynchronous drivers (`asyncpg`).
  * **Auth Service (Port 8001):** User credentials, registration, session management, and JWT validation.
  * **Movie Service (Port 8002):** Movies catalogs, active cinema schedules, screens, and genres databases.
  * **Reservation Service (Port 8003):** Ticket reservation locks, transactions, and seat allocations.
* **Infrastructure Services:**
  * **PostgreSQL:** Separate databases mapping to each microservice (`auth_db`, `movie_db`, `reservation_db`).
  * **Apache Kafka:** Event message broker managing asynchronous messaging and states across microservices.
  * **Redis:** In-memory key-value cache handling real-time seat locks and reservation expirations.

---

## Contributors

* **Project Manager, Lead Frontend Developer:** Matvii Maliuta ([@Kozak8909](https://github.com/Kozak8909))
* **Frontend Developer, UI/UX Designer:** Zakhar Illenko ([@3ikosik](https://github.com/3ikosik))
* **Frontend Developer:** Volodymyr Brahar ([@volodymyrbrahar](https://github.com/volodymyrbrahar))
* **Lead Backend Developer:** Pavel Melnik ([@glekaa](https://github.com/glekaa))
