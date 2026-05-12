# 🐾 MD PawVita E-Commerce & Clinic Platform

A full-stack, multi-role e-commerce and veterinary clinic platform built with Next.js 15. This application allows users to adopt/shop for pets and pet supplies, book appointments with verified veterinarians, and provides dedicated dashboards for Users, Vets, and Admins.

## 👥 Group Members

- **Moiz Ansari** [23i-0523]
- **Muhammad Daniyal** [23i-0579]

---

## ✨ Key Features

### 🛒 E-Commerce Experience

- **Product Catalog:** Browse a wide variety of live pets and pet products.
- **Advanced Filtering & Sorting:** Dynamically filter products by Category, Age, and Price. Sort by Name or Price.
- **Cart & Checkout:** Seamless cart management and secure checkout flow.
- **Wishlist:** Users can save their favorite pets or products for later.

### 🩺 Veterinary Clinic Integration

- **Vet Directory:** Public listing of verified veterinarians.
- **Appointment Booking:** Pet owners can book consultations, grooming, or checkups with available vets.
- **Vet Onboarding:** Secure registration flow for veterinarians requiring Admin approval before activation.

### 🛡️ Role-Based Dashboards

- **Admin Dashboard:** Centralized control panel to manage platform metrics, verify/approve new Vet accounts, and monitor global appointments and product listings.
- **Vet Dashboard:** Dedicated space for veterinarians to manage their availability, view patient descriptions, and confirm/cancel appointments.
- **User Dashboard:** Personal account center for customers to track order history, manage profile settings, and view upcoming vet appointments.

### 🎨 Modern UI/UX

- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.
- **Dark/Light Mode:** Seamless theme switching.
- **Micro-Interactions:** Smooth page transitions and element animations powered by Framer Motion and custom animation components.
- **Integrated Chatbot:** Sidebar AI assistant to help users navigate the store and find information.

---

## 🛠️ Tech Stack

| Technology | Details |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB |
| **ORM** | Mongoose |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A [MongoDB](https://www.mongodb.com/) database (Atlas or local)

### 2. Clone the Repository

```bash
git clone https://github.com/MuhammaDaniyal/pet-store.git
cd pet-store
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory of the project and add your specific configuration keys:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
SMTP_URL=your_smtp_connection_url
GROQ_API_KEY=your_groq_api_key
```

### 5. Seed the Database

To populate your database with initial categories, products, and a default admin/vet account, run the seed script:

```bash
npx tsx scripts/seed.ts
```

> **Note:** The seed script uses smart-seeding. It will not overwrite or delete your existing data if the collections are already populated.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

```text
├── scripts/             # Database seeding logic (seed.ts)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (auth)/      # Sign-in, Sign-up, OTP Verification flows
│   │   ├── (protected)/ # User account space, cart, and checkout
│   │   ├── (public)/    # Shop, vet directory, landing, and static pages
│   │   ├── admin/       # Admin layout, stats, vet approval, and overviews
│   │   ├── api/         # Next.js Backend API routes
│   │   └── vet/         # Veterinarian dashboard and appointment management
│   ├── components/      # Reusable React components
│   │   ├── account/     # User account specific components
│   │   ├── admin/       # Admin specific tables and sidebars
│   │   ├── animations/  # Framer Motion animated components
│   │   ├── chatbot/     # AI Chatbot wrappers and UI
│   │   └── shop/        # Product cards, Filters, and Sorting panels
│   ├── lib/             # Utility functions, DB connection, Auth, Email logic
│   │   └── models/      # Mongoose Database Schemas (User, Vet, Appointment, etc.)
│   └── styles/          # Global CSS, Fonts, and Tailwind theme directives
├── public/              # Static assets (SVGs, Favicon)
└── package.json         # Project dependencies and scripts
```

---

## 🔄 Core Workflows

1. **Purchasing a Pet:**
   User navigates to `/shop` → Filters by Category/Age → Adds item to Cart → Proceeds to Checkout → Order appears in `/account/orders`.

2. **Booking a Vet:**
   User navigates to `/vets` → Selects a verified Vet → Fills out pet details & reason for visit → Appointment is logged as `pending` in `/account/appointments`.

3. **Vet Approval Loop:**
   Vet registers via `/sign-up` → Completes OTP → Profile is flagged `isVerified: false` → Admin logs in and goes to `/admin/vets` → Admin verifies Vet → Vet receives welcome email and can now log in to `/vet/dashboard`.

---

## 📄 License

This project is for academic and portfolio purposes. All external assets, images, and tools belong to their respective creators.

## 🤝 Support

If you encounter any issues during setup or testing, please refer to the codebase comments or reach out to the repository maintainers.
