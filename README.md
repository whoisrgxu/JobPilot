# JobPilot

JobPilot is an AI-powered web application that helps job seekers instantly generate tailored, professional cover letters. By leveraging advanced AI models, users can simply paste their resume and a job description—or upload their resume as a PDF—and receive a personalized cover letter in seconds.

## Features

- **AI-Generated Cover Letters:** Instantly create unique, high-quality cover letters tailored to your resume and the job description.
- **Multiple Input Modes:** Paste your resume as text or upload a PDF file.
- **Customizable Tone:** Choose from several tones (Enthusiastic, Professional, Confident, Friendly, Persuasive, Creative) to match your application style.
- **User Registration & Authentication:** Securely register and log in to manage your cover letter generations.
- **Modern UI:** Responsive, dark-mode friendly interface built with Next.js, Tailwind CSS, and Material UI.
- **Privacy First:** Your data is processed securely and never shared.

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jobpilot.git
   cd jobpilot
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables:**  
   Create a `.env.local` file in the root directory and add the required environment variables for your AI model, authentication, and any API keys. For example:
   ```env
   AI_MODEL_API_KEY=your-api-key-here
   AI_MODEL_PROVIDER=your-provider-name
   AUTH_SECRET=your-auth-secret
   # Add any other required variables here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — Main application code (pages, components, styles)
- `src/store/atoms.ts` — State management using Jotai
- `src/app/specialStyling.css` — Custom CSS for card effects and UI enhancements

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [Jotai](https://jotai.org/) for state management
- [Google Gemini API](https://ai.google.dev/)

## License

This project is licensed under the MIT License.

---

**JobPilot** — Save time, stand out, and apply with confidence.
