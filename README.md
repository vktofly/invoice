# Invoice App

This is a full-stack invoicing application built with Next.js, Supabase, and Stripe.

## Features

- Create, manage, and track invoices.
- Customer management.
- Secure payments with Stripe and Razorpay.
- PDF generation for invoices.
- Dashboard with analytics.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/), [Lucide React](https://lucide.dev/)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **Payments:** [Stripe](https://stripe.com/), [Razorpay](https://razorpay.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **PDF Generation:** [React-PDF](https://react-pdf.org/)
- **Charting:** [Chart.js](https://www.chartjs.org/), [Recharts](https://recharts.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd invoice-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the necessary environment variables for Supabase, Stripe, and any other services. You can use `.env` as a template.

4.  **Run the database migrations (if any):**

    This project uses Supabase for the database. You will need to set up your database schema. The SQL files can be found in the `/sql` directory.

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase.
