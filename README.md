# JobPilot

JobPilot is an AI-powered web app that helps job seekers evaluate how well their resume matches a job description. By leveraging large language models, users can upload or paste their resume and a job posting, and instantly receive a professional report analyzing alignment and offering improvement suggestions.

## ✨ Features

- **Resume-to-Job Fit Analyzer**  
  Get a detailed AI-generated report on how well your resume matches the job description.

- **Multiple Input Modes**  
  Paste your resume as text or upload a PDF file.

- **Industry Context Awareness**  
  Select or input your industry to receive more tailored insights.

- **User Registration & Authentication**  
  Secure login system with token-based authentication.

- **Modern, Responsive UI**  
  Clean and dark-mode friendly interface built with Next.js, Tailwind CSS, and Material UI.

- **Pro Tier Bonus**  
  Paid users can access personalized roadmaps to improve their fit for specific job roles.

## 🚀 Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/jobpilot.git
   cd jobpilot
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file in the root directory and add:

   ```env
   GOOGLE_API_KEY=your-google-api-key
   GOOGLE_MODEL=gemini-2.0-pro
   JWT_SECRET=your-auth-secret
   MONGODB_URI=your-mongodb-uri
   REDIS_URL=your-redis-url
   ```

4. **Run the development server**  
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Visit the app**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app/` – Main application code (routes, pages, components)
- `src/store/atoms.ts` – Jotai atoms for global state
- `src/lib/` – Utility functions (e.g. rate limiter)
- `src/components/` – Reusable UI components
- `src/middleware/` – Custom middlewares (e.g. usage checker)
- `src/utils/` – Prompt builders and helpers

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [Jotai](https://jotai.org/)
- [Google Gemini API](https://ai.google.dev/)
- [Redis](https://redis.io/)
- [MongoDB](https://www.mongodb.com/)

## 🌐 Live Demo

👉 [https://jobpilot.rogerxu.dev](https://jobpilot.rogerxu.dev)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**JobPilot** — Analyze smarter. Apply stronger.
