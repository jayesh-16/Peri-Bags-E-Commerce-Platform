# Peri Bags E-Commerce Platform

A fully functional, modern e-commerce platform built for high performance and sleek design. Features include a dynamic product catalog, a secure shopping cart, an intuitive administrative dashboard, and seamless cloud integrations.

## 🚀 Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Database Provider:** [Neon PostgreSQL](https://neon.tech/)
*   **Authentication:** [NextAuth.js (v5)](https://next-auth.js.org/)
*   **Image Hosting:** [Cloudinary](https://cloudinary.com/)

## ✨ Key Features

*   **Responsive Storefront:** Beautiful, mobile-first design with smooth animations and dynamic routing.
*   **Secure Authentication:** Email & password authentication with secure bcrypt hashing and JWT session management.
*   **Admin Dashboard:** A dedicated, role-based `/admin` portal for managing products, categories, orders, customers, and promotional banners.
*   **Cloud Image Uploads:** Seamless product and banner image uploading directly to Cloudinary from the Admin panel.
*   **Shopping Cart:** Persistent, state-managed shopping cart experience.
*   **SEO Optimized:** Server-side rendered pages with built-in metadata.

## 🛠️ Local Development Setup

Follow these steps to run the application on your local machine:

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the project and populate it with the following:
```env
# Database (Neon PostgreSQL or Local PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth
NEXTAUTH_SECRET="generate-a-secure-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Required for Image Uploads in the Admin Dashboard)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup
Push the Prisma schema to your database and seed it with initial data (demo products, categories, and an admin user).
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Production Deployment (Vercel)

This project is optimized for deployment on Vercel. 

1. Push your code to a GitHub repository.
2. Import the project into your Vercel Dashboard.
3. In the Vercel **Environment Variables** settings, add your `DATABASE_URL`, `NEXTAUTH_SECRET`, and your `CLOUDINARY` keys.
4. (Optional) Once deployed, set your `NEXTAUTH_URL` to your production domain (e.g., `https://your-domain.vercel.app`) in the Vercel settings and redeploy.
5. Vercel will automatically run `npm run build` and `npx prisma generate` during the deployment phase.

---

*Bootstrapped with `create-next-app`.*
