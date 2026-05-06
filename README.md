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

CineTube Server is a robust backend API that powers a modern movie streaming platform, providing secure authentication, content management, and subscription handling capabilities.

---

## ❓ Problem Statement

Building a movie streaming platform requires handling complex backend operations including secure user authentication, subscription management with payment processing, content organization, and watchlist functionality. Developers often struggle with integrating these systems securely and efficiently, especially when dealing with payment webhooks, role-based access control, and database relationships.

---

## 💡 Solution Overview

CineTube Server solves these challenges by providing a **production-ready REST API** built with modern technologies:

- **Modular Architecture** — Feature-based module organization (auth, movies, users, subscriptions) for maintainable and scalable code
- **Secure Authentication** — Better Auth integration with email/password, OAuth, and session management via HTTP-only cookies
- **Payment Integration** — Complete Stripe implementation for tiered subscriptions with webhook handling for real-time payment events
- **Type Safety** — Full TypeScript coverage with Zod validation for runtime input safety
- **Database Management** — Prisma ORM with PostgreSQL for reliable data persistence and complex relationships
- **Email Automation** — Nodemailer integration for password resets and user notifications
- **Admin Dashboard Support** — Role-based access control with dedicated endpoints for platform management

This backend serves as the reliable backbone for the CineTube Next.js frontend, handling all core platform operations while maintaining security, performance, and developer experience.

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

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 20+ installed
- **PostgreSQL** database
- **pnpm** package manager (`npm install -g pnpm`)
- **Stripe** account (for payments)
- **Google OAuth** credentials (optional, for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tausif-islam-sheik/CineTube-Server.git
   cd CineTube-Server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Fill in all required variables (see Environment Variables section below)

4. **Set up the database**
   ```bash
   # Run Prisma migrations
   pnpm migrate
   
   # Or push the schema directly
   pnpm push
   ```

5. **Seed the database**
   ```bash
   # Seed subscription tiers
   pnpm seed:tiers
   
   # Seed admin account
   pnpm seed:admin
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```
   The server will start at `http://localhost:5000` (or your configured PORT).

7. **(Optional) Start Stripe webhook listener for local development**
   ```bash
   pnpm stripe:webhook
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Application
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

### Database
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/cinetube` |

### Authentication
| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Secret key for Better Auth sessions |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### Email (SMTP)
| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_ENV` | Email environment mode | `development` or `production` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | `your-app-password` |
| `SMTP_FROM` | Sender email address | `noreply@cinetube.com` |
| `SMTP_SECURE` | Use TLS | `false` for port 587, `true` for 465 |
| `ETHEREAL_USER` | Ethereal Email user (dev testing) | (optional) |
| `ETHEREAL_PASS` | Ethereal Email password (dev testing) | (optional) |

### Payments (Stripe)
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_... or sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |

### Admin Seed
| Variable | Description |
|----------|-------------|
| `ADMIN_EMAIL` | Default admin account email |
| `ADMIN_PASSWORD` | Default admin account password |

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

Made with ❤️ by [Tausif Islam Sheik](https://www.linkedin.com/in/tausif-islam-sheik)

</div>
