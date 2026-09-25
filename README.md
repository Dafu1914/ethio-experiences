# Ethio Experiences

A GetYourGuide-style marketplace for Ethiopian tours, treks, and cultural experiences.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Emails:** Resend
- **Payments:** Chapa + Telebirr (coming soon)

## Features

- 🔐 Auth (JWT access + refresh tokens)
- 🏛️ Listings (create, edit, approve, browse)
- 🔍 Search + filters (city, category, price, sort)
- 📅 Booking flow (modal → confirmation → voucher)
- 👤 Vendor portal (self-service onboarding)
- 🛡️ Admin panel (approve listings, manage users)
- ⭐ Reviews & ratings
- 🌍 Multi-language (EN / AM / OM)
- 💱 Multi-currency (ETB / USD / EUR)
- 📱 Mobile-responsive

## Local setup

```bash
git clone https://github.com/YOUR_USERNAME/ethio-experiences.git
cd ethio-experiences

# API
cd apps/api
cp .env.example .env
# Edit .env with your MongoDB + Resend credentials
npm install
npm run seed   # optional: seed 10 Ethiopian tours
npm run dev    # → http://localhost:4000

# Web (new terminal)
cd apps/web
cp .env.example .env.local
npm install
npm run dev    # → http://localhost:3000