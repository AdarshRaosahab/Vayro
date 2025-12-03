# VAYRO Developer Guide

This guide explains how to maintain and modify the VAYRO codebase.

## Project Structure

- **`pages/`**: Contains all the routes of the application.
    - `pages/index.tsx`: The home page.
    - `pages/api/`: Backend API routes.
    - `pages/[code].tsx`: The dynamic route that handles link redirection.
- **`components/`**: Reusable UI components (Buttons, Cards, Layouts).
- **`lib/`**: Utility functions, database connection, and business logic.
- **`prisma/`**: Database schema and migrations.
- **`public/`**: Static assets like images and fonts.
- **`styles/`**: Global CSS and Tailwind configuration.

## Common Tasks

### 1. Changing Content (Text/Images)
Most content is directly in the `pages/` files.
- To change the **Home Page**: Edit `pages/index.tsx`.
- To change **Contact Info**: Edit `pages/contact.tsx`.
- To change **Pricing**: Edit `pages/pricing.tsx`.

### 2. Modifying the Database
We use **Prisma** to manage the database.
1.  Edit `prisma/schema.prisma` to change the data model.
2.  Run `npx prisma db push` to apply changes to the database.
3.  Run `npx prisma generate` to update the TypeScript client.

### 3. Adding a New Page
Create a new file in `pages/`.
- Example: `pages/about.tsx` will be accessible at `vayro.in/about`.

### 4. Environment Variables
Configuration is stored in `.env`.
- **Database**: `DATABASE_URL` and `DIRECT_URL`.
- **Auth**: `SESSION_SECRET`, etc.
- **Keys**: `RAZORPAY_KEY_ID`, `ADSENSE_CLIENT_ID`.

**Never commit `.env` to version control.**

## Deployment

To deploy changes:
1.  Push your code to GitHub.
2.  Vercel (or your hosting provider) will automatically build and deploy the new version.
3.  Ensure your Environment Variables are set in the hosting dashboard.

## Troubleshooting

- **Server Errors**: Check the logs in your hosting dashboard.
- **Database Issues**: Ensure `DATABASE_URL` is correct and the database is running.
- **Build Failures**: Run `npm run build` locally to see errors before pushing.
