# Appointment Booking Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

*   **Frontend Framework:** Next.js
*   **UI Components:** Shadcn UI
*   **Database:** Neon PostgreSQL

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

To run this project locally, you will need to set up your environment variables. Create a `.env` file in the root of the project and add the following:

```
DATABASE_URL="YOUR_NEON_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="YOUR_JWT_SECRET"
```

*   **`DATABASE_URL`**: Your connection string for the Neon PostgreSQL database.
*   **`JWT_SECRET`**: A random string used for signing and verifying JSON Web Tokens (JWTs) for authentication.

## Authentication

This application uses a custom JWT-based authentication system. User passwords are not hashed before storage, which is a **security vulnerability** and should be addressed in a production environment.

## What can I do if I have 2 more hours?

*   **UI/UX Improvements:**
    *   Change the card structure UI for a more modern and intuitive look.
    *   Improve overall UI/UX with more animations and transitions.
*   **Feature Enhancements:**
    *   Implement a notification system for booking confirmations and reminders (leveraging existing email fields).
    *   Add functionality for appointment cancellation and rescheduling.
*   **Security & Data Management:**
    *   Implement secure password hashing (e.g., using bcrypt) for user registration and login.
    *   Encrypt sensitive data in the database for enhanced security.
*   **Testing:**
    *   Add unit and integration tests for critical functionalities.

## Deployment

*   **Deployment URL:** https://wundrsight-booking-dev.vercel.app

## Repository

*   **Repository URL:** https://github.com/sirish26/appointment-booking.git

## Postman Steps

To interact with the API endpoints using Postman, you can import the Postman collection (if available) or manually set up requests.

**Authentication Flow (JWT):**

1.  **Register:**
    *   **URL:** `http://localhost:3000/api/register`
    *   **Method:** `POST`
    *   **Headers:** `Content-Type: application/json`
    *   **Body (raw JSON):**
        ```json
        {
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
        ```
2.  **Login:**
    *   **URL:** `http://localhost:3000/api/login`
    *   **Method:** `POST`
    *   **Headers:** `Content-Type: application/json`
    *   **Body (raw JSON):**
        ```json
        {
            "email": "test@example.com",
            "password": "password123"
        }
        ```
    *   **Response:** A successful login will set an `auth-token` cookie in your Postman client. This cookie will be automatically sent with subsequent requests to authenticated endpoints.

**Common Endpoints (Authenticated):**

*   **GET /api/slots**: Retrieve available booking slots.
*   **POST /api/book**: Book a slot.
    *   **URL:** `http://localhost:3000/api/book`
    *   **Method:** `POST`
    *   **Headers:** `Content-Type: application/json`
    *   **Body (raw JSON):**
        ```json
        {
            "slotId": "YOUR_SLOT_ID"
        }
        ```
*   **GET /api/my-bookings**: Retrieve a user's bookings.
*   **GET /api/all-bookings**: Retrieve all bookings (Admin only).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.