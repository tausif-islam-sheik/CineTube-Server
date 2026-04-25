<div align="center">

# ⚙️ CineTube Server

**REST API server powering the CineTube movie streaming platform**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169e1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?logo=stripe)](https://stripe.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

[Frontend Repository](https://github.com/tausif-islam-sheik/CineTube) | [Frontend Live URL](https://cinetube-omega.vercel.app) — Next.js Web Application

</div>

---

## 📖 Overview

CineTube Backend is a production-ready REST API built with Express and TypeScript. It handles all core platform operations — user authentication, movie data management, personal watchlists, tiered subscriptions, and Stripe payment processing — serving as the backbone for the CineTube Next.js frontend.

---

## ✨ Features

### 🔐 Authentication
- Email/password registration and login via Better Auth
- Password reset with email verification (Nodemailer)
- Secure session management using HTTP-only cookies
- Optional Google OAuth integration
- Role-based access control (User / Admin)

### 🎬 Movie Management
- Full CRUD operations for movie records
- Category-based filtering (Trending, Popular, Upcoming)
- Title search with query support
- Admin-only write endpoints

### 👤 User Features
- Watchlist management (add / remove movies)
- User profile management
- Subscription history access

### 💳 Subscriptions & Payments
- Multiple pricing tiers (Basic, Standard, Premium)
- Stripe Checkout session creation
- Webhook handling for real-time payment events
- Automatic subscription status sync

### 🛠️ Admin Panel
- Platform-wide dashboard statistics
- User and movie management
- Full subscription overview

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Express.js | REST API and routing |
| **Language** | TypeScript | Type safety across the codebase |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Prisma | Schema modeling and query builder |
| **Authentication** | Better Auth | Session and credential management |
| **Payments** | Stripe | Subscription billing and webhooks |
| **Email** | Nodemailer | Password reset and notifications |
| **Security** | bcryptjs | Password hashing |
| **Validation** | Zod | Runtime input validation |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── config/                 # Environment configuration
│   │   └── env.ts
│   ├── lib/                    # Core libraries
│   │   ├── auth.ts             # Better Auth configuration
│   │   ├── email.ts            # Email service
│   │   └── prisma.ts           # Prisma client
│   ├── middleware/             # Express middleware
│   │   └── checkAuth.ts        # Authentication middleware
│   ├── module/                 # Feature modules
│   │   ├── auth/               # Authentication handlers
│   │   ├── movie/              # Movie CRUD operations
│   │   ├── user/               # User management
│   │   └── subscription/       # Payment and subscriptions
│   ├── shared/                 # Shared utilities
│   │   ├── catchAsync.ts       # Async error handler
│   │   └── sendResponse.ts     # API response formatter
│   └── utils/                  # Helper functions
│       ├── cookie.ts           # Cookie utilities
│       └── adminSeed.ts        # Admin account seeder
├── prisma/
│   └── schema.prisma           # Database schema
└── server.ts                   # Application entry point
```


---

## 🗄️ Database Schema

| Model | Description |
|-------|-------------|
| `User` | User accounts with assigned roles |
| `Account` | Better Auth credential storage |
| `Session` | Active user sessions |
| `Verification` | Email verification tokens |
| `Movie` | Movie records (title, description, poster, metadata) |
| `Watchlist` | User-saved movie collections |
| `SubscriptionTier` | Available plan definitions (Basic / Standard / Premium) |
| `Subscription` | User subscription records with Stripe references |

---

## 📡 API Reference

### Authentication — Better Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up/email` | Register a new user |
| `POST` | `/api/auth/sign-in/email` | Login with email & password |
| `POST` | `/api/auth/forgot-password` | Request a password reset email |
| `POST` | `/api/auth/reset-password` | Reset password using token |
| `GET` | `/api/auth/session` | Retrieve the current session |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/movies` | List all movies |
| `GET` | `/api/v1/movies/:id` | Get a single movie by ID |
| `POST` | `/api/v1/movies` | Create a movie *(Admin)* |
| `PATCH` | `/api/v1/movies/:id` | Update a movie *(Admin)* |
| `DELETE` | `/api/v1/movies/:id` | Delete a movie *(Admin)* |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/watchlist` | Get the authenticated user's watchlist |
| `POST` | `/api/v1/watchlist` | Add a movie to watchlist |
| `DELETE` | `/api/v1/watchlist/:id` | Remove a movie from watchlist |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/subscriptions` | Get user's subscription records |
| `POST` | `/api/v1/subscriptions` | Create a new Stripe Checkout session |
| `POST` | `/webhook` | Stripe webhook event handler |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/dashboard` | Platform statistics and analytics |
| `GET` | `/api/v1/admin/users` | List all registered users |
| `GET` | `/api/v1/admin/subscriptions` | List all subscriptions |

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

<div align="center">

Made with ❤️ by [Tausif Islam Sheik](https://github.com/tausif-islam-sheik)

</div>
