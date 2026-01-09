# Traceability Tool Setup Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure
- `/app` - Next.js 13+ app directory with pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/hooks` - Custom React hooks
- `/public` - Static assets

## Key Features
- Material tracking and inventory management
- Lot management and traceability
- Partner and supplier management
- Order processing and dispatch
- Settlement generation
- Mass balance calculations

## Technology Stack
- Next.js 13.5.1
- React 18.2.0
- TypeScript
- Tailwind CSS
- Radix UI components
- React Query for data fetching
- Zustand for state management