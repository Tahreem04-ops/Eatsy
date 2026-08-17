# 🍽️ Eatsy — Commission-Free Restaurant & Cafe Digital Twin

> **Modern, commission-free QR table ordering, live stock tracking, Kitchen Display System (KDS), guest loyalty, table reservations, and real-time sales analytics built for independent UK high-street venues.**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Overview

**Eatsy** is a full-stack digital twin platform for UK restaurants, pubs, and takeaways. It replaces expensive 30% third-party marketplace delivery fees with your own branded digital menu. Guests scan table QR codes, order, and pay directly from their phones with real-time menu stock sync and 4-language support.

---

## ✨ Key Features

- **📱 QR Table Ordering (`/menu`)**:
  - Scan table QR codes (`/menu?table=12`) with pre-filled table numbers.
  - Live stock indicators (*Low stock*, *Sold out* badges).
  - Add to cart, service fee calculation (10%), and phone payment workflow.

- **👨‍🍳 Kitchen Display System (`/kitchen`)**:
  - Live order management queue for kitchen staff.
  - One-click order state transitions (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Served`).
  - Real-time stock adjustment controls (instantly toggle sold-out items).
  - Live table reservation feed.

- **🌐 Multi-Lingual & RTL Support**:
  - **4 Supported Languages**: English, Urdu (اردو), Polish (Polski), Arabic (العربية).
  - Dynamic **Right-to-Left (RTL)** layout switching for Urdu and Arabic.

- **🎁 Guest Loyalty & Referral Engine (`/loyalty`)**:
  - Automated tier levels: **Bronze**, **Silver**, **Gold**.
  - 10 points awarded per £1 spent.
  - Custom referral code generation (`KETTLE-AZ`) and point-based reward redemptions.

- **📊 Real-Time Analytics Dashboard (`/analytics`)**:
  - Live financial statistics (Total Revenue, Average Order Value, Commission Saved vs 30% delivery app fees).
  - Interactive peak-hour order bar charts and customer retention curves powered by Recharts.
  - Day & service slot dish order heatmaps and top dish sales leaderboards.

- **📅 Table Booking Engine (`/book`)**:
  - Instant table reservations with party size, date, time selection, and SMS confirmation.

- **🎨 Modern Design System**:
  - Warm British high-street aesthetic: Bottle Green, Warm Amber, Cream (`src/styles.css`).
  - Built with Tailwind CSS v4 custom OKLCH color tokens, glassmorphism headers, and Google Fonts (`Fraunces` + `Manrope`).

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (OKLCH color system) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [Sonner Toasts](https://sonner.emilkowal.ski/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Backend & DB** | TanStack `createServerFn` + Persistent JSON Store (`data/eatsy_db.json`) |

---

## 📁 Project Directory Structure

```text
Eatsy/
├── data/
│   └── eatsy_db.json        # Persistent JSON database (orders, dishes, bookings, loyalty)
├── public/                  # Static assets & favicons
├── src/
│   ├── components/
│   │   ├── site-shell.tsx   # Header navigation with language switcher & footer
│   │   └── ui/              # Reusable UI primitives
│   ├── lib/
│   │   ├── cart.tsx         # Stateful cart context with local storage sync
│   │   ├── i18n.tsx         # Multi-lingual dictionaries (EN, UR, PL, AR) & RTL provider
│   │   ├── menu-data.ts     # Menu dish catalog & default analytics datasets
│   │   └── utils.ts        # Helper functions
│   ├── routes/
│   │   ├── __root.tsx       # Root layout & global Query/Toaster providers
│   │   ├── index.tsx        # Hero landing page & commission calculator
│   │   ├── menu.tsx         # Customer QR table ordering page
│   │   ├── kitchen.tsx      # Kitchen Display System (KDS) & staff portal
│   │   ├── loyalty.tsx      # Guest rewards & tier lookup page
│   │   ├── analytics.tsx    # Sales & dish performance analytics dashboard
│   │   └── book.tsx         # Table reservation page
│   ├── server/
│   │   ├── db.ts            # Persistent DB CRUD operations (dishes, orders, bookings, loyalty)
│   │   └── api.ts           # TanStack Start server functions (createServerFn)
│   ├── router.tsx           # TanStack Router initialization
│   ├── server.ts           # SSR server entry point
│   ├── start.ts            # TanStack Start middleware & CSRF protection
│   └── styles.css          # Design tokens (OKLCH colors, typography, utility classes)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js (v18 or higher)** installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tahreem04-ops/Eatsy.git
   cd Eatsy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to **`http://localhost:8080`**.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🔗 Key Routes Quick Links

- 🏠 **Home Landing**: `http://localhost:8080/`
- 🍕 **QR Table Menu**: `http://localhost:8080/menu?table=12`
- 👨‍🍳 **Kitchen Display (KDS)**: `http://localhost:8080/kitchen`
- 🎁 **Loyalty Engine**: `http://localhost:8080/loyalty`
- 📊 **Analytics Dashboard**: `http://localhost:8080/analytics`
- 📅 **Book a Table**: `http://localhost:8080/book`

---

## 📄 License

Built for independent UK high-street restaurants, pubs, and cafes. Open-source under the [MIT License](LICENSE).
