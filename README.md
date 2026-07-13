# DiagBook — Diagnostic Test Booking MVP

A full-stack MVP for booking diagnostic tests and health packages with home sample collection.

**Stack:** React.js (Vite) · Node.js (Express) · MongoDB

## Features

- User registration & login (JWT)
- Browse popular tests and packages
- Filter tests/packages by disease category
- Disease-based browsing (Diabetes, Thyroid, Heart, etc.)
- Test & package detail pages
- Shopping cart & checkout flow
- Quick book form (minimal steps, no login required)
- Pincode serviceability check
- My bookings dashboard
- User profile & saved addresses

## Project Structure

```
diagnostic-booking-mvp/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── models/   # User, Test, Package, Disease, Booking
│       ├── routes/
│       ├── controllers/
│       └── seed.js   # Sample data
└── frontend/         # React + Vite
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── api/
```

## Prerequisites

- Node.js 18+
- MongoDB (local, Docker, or MongoDB Atlas)

## Setup & Run

### 0. Start MongoDB (choose one)

**Option A — Docker (recommended):**
```bash
docker compose up -d
```

**Option B — Local MongoDB:** Ensure `mongod` is running on port 27017.

**Option C — MongoDB Atlas:** Set `MONGODB_URI` in `backend/.env`.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit MONGODB_URI if needed
npm run seed           # Seed tests, packages, diseases
npm run dev            # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/tests` | List tests (filter: `disease`, `search`, `sort`) |
| GET | `/api/tests/popular` | Popular tests |
| GET | `/api/packages` | List packages |
| GET | `/api/diseases` | Disease categories |
| GET | `/api/diseases/:slug` | Tests & packages by disease |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | User bookings (auth) |
| GET | `/api/bookings/pincode/:pincode` | Check serviceability |

## Sample Serviceable Pincodes

`122001`–`122011` (Gurgaon), `110001`–`110025` (Delhi), `560001`–`560100` (Bangalore)

## MVP Seed Data

- **13 tests** (CBC, Thyroid, HbA1c, Vitamin D, etc.)
- **5 packages** (Basic Health, Diabetes Care, Women's Wellness, etc.)
- **10 disease categories**

## Demo Flow

1. Visit homepage → check pincode `122001`
2. Browse popular tests or packages
3. Use **Quick Book** to book without login
4. Or register → add to cart → checkout
5. View booking in **My Bookings**

## Next Steps (Post-MVP)

- Razorpay payment integration
- Admin panel for managing tests/packages
- SMS/WhatsApp notifications
- Report PDF upload & download
- OTP-based login
- Multi-city expansion

## License

MIT — MVP demo project
