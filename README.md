
# PlotPesa

PlotPesa is a specialized digital marketplace for land plots in Kenya.

## Features

- **User Roles**: Separate portals for Plot Owners, verified Agents, Buyers, and Admins.
- **Verification**: Document upload and admin workflow to verify title deeds and agent licenses.
- **Search**: Advanced filtering by county, price, size, and type.
- **Security**: Built on Supabase for robust authentication and data security.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet.js

## Getting Started

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd plotpesa
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and fill in your Supabase and Resend keys.

3. **Run Database Schema**
   Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Folder Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and Supabase clients.
- `/types`: TypeScript type definitions.
- `/supabase`: SQL schemas and migrations.
