# TRF Climaone - Frontend Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Design System](#design-system)
8. [Components](#components)
9. [Pages & Routes](#pages--routes)
10. [State Management](#state-management)
11. [API Integration](#api-integration)
12. [Authentication](#authentication)
13. [Setup & Development](#setup--development)
14. [Environment Configuration](#environment-configuration)

---

## 🎯 System Overview

**TRF Climaone** is a comprehensive **Textile Recovery Facility Management System** designed to track, manage, and optimize textile waste processing operations. The system provides end-to-end traceability from material collection to final processing and sales.

### Business Purpose
- **Textile Waste Management**: Track textile waste from collection to processing
- **Partner Management**: Manage collection partners and processors
- **Inventory Control**: Monitor material inventory by waste categories
- **Traceability**: Complete supply chain visibility
- **Compliance**: Environmental and regulatory compliance tracking

---

## 🏗️ Architecture

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│              Next.js App Router         │
├─────────────────────────────────────────┤
│  Pages (App Directory)                  │
│  ├── Dashboard                          │
│  ├── Partners Management               │
│  ├── Material Collection               │
│  ├── Inventory Management              │
│  ├── Packaging & Lots                  │
│  └── Authentication                    │
├─────────────────────────────────────────┤
│  Components Layer                       │
│  ├── UI Components (Radix UI)          │
│  ├── Layout Components                 │
│  ├── Business Components               │
│  └── Modal Components                  │
├─────────────────────────────────────────┤
│  State Management                       │
│  ├── React Query (Server State)        │
│  ├── Zustand (Client State)            │
│  └── React Hook Form (Form State)      │
├─────────────────────────────────────────┤
│  Styling & Design                       │
│  ├── Tailwind CSS                      │
│  ├── Custom CSS Variables              │
│  └── Professional Design System        │
└─────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Library**: Radix UI Components
- **State Management**: React Query + Zustand
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js built-in

---

## 📁 Project Structure

```
TRF-Climaone-main/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   └── login/
│   ├── api/                      # API routes
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── partners/
│   │   └── ...
│   ├── inventory/                # Inventory management
│   ├── material-in/              # Material collection
│   ├── partners/                 # Partner management
│   │   ├── collection/           # Collection partners
│   │   └── processors/           # Processors
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard
├── components/                   # Reusable components
│   ├── ui/                       # UI components (Radix)
│   ├── layout/                   # Layout components
│   ├── create-collection-partner-modal.tsx
│   ├── create-processor-modal.tsx
│   └── data-table.tsx
├── lib/                          # Utilities & configurations
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Utility functions
│   ├── auth.ts                   # Authentication logic
│   └── mock-data.ts              # Mock data
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
└── Configuration files
```

---

## 🚀 Core Features

### 1. Dashboard
- **Overview Metrics**: Total materials, active partners, processing status
- **Material Collection Charts**: Visual representation of collection data
- **Quick Actions**: Access to key functions
- **Recent Activities**: Latest system activities

### 2. Partner Management
#### Collection Partners
- **Partner Registration**: Multi-step form with user account, company details, and facility information
- **Partner Listing**: Searchable table with stats (total, active, monthly additions)
- **Partner Profiles**: Detailed partner information and history

#### Processors
- **Processor Registration**: Similar to collection partners but for material processors
- **Processor Management**: Track processors who purchase materials
- **Order Tracking**: Monitor orders and shipments

### 3. Material Collection (Material In)
- **Material Entry**: Record incoming textile materials
- **Waste Categorization**: Post-consumer, Industrial, Institutional
- **Weight & Quality Tracking**: Detailed material specifications
- **Source Tracking**: Link materials to collection partners

### 4. Inventory Management
- **Category-wise Inventory**: Organized by waste categories
- **Real-time Tracking**: Current stock levels and values
- **Search & Filtering**: Advanced filtering options
- **Visual Indicators**: Charts and progress indicators

### 5. Material Processing (Material Out)
- **Processing Records**: Track material processing activities
- **Quality Control**: Processing quality metrics
- **Batch Management**: Organize materials into processing batches

### 6. Packaging & Lots
- **Lot Creation**: Group materials for processing or sale
- **Package Management**: Track packaged materials
- **Shipment Preparation**: Prepare materials for shipment

---

## 👥 User Roles & Permissions

### Available Roles
1. **ADMIN**: Full system access
2. **GATE**: Gate operations and material entry
3. **SEG**: Segregation and quality control
4. **INVENTORY**: Inventory management
5. **SALES**: Sales and order management
6. **FINANCE**: Financial operations
7. **AUDITOR**: Audit and compliance

### Demo Credentials
```javascript
{
  "admin@trf.com": { "password": "admin123", "role": "ADMIN" },
  "gate@trf.com": { "password": "gate123", "role": "GATE" },
  "seg@trf.com": { "password": "seg123", "role": "SEG" },
  "inventory@trf.com": { "password": "inventory123", "role": "INVENTORY" },
  "sales@trf.com": { "password": "sales123", "role": "SALES" },
  "finance@trf.com": { "password": "finance123", "role": "FINANCE" },
  "auditor@trf.com": { "password": "auditor123", "role": "AUDITOR" }
}
```

---

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` to `#1d4ed8` (gradients)
- **Secondary Blue**: `#1d4ed8` to `#1e40af`
- **Light Blue**: `#eff6ff` (backgrounds)
- **Success Green**: `#10b981` to `#059669`
- **Error Red**: `#ef4444` to `#dc2626`
- **Warning Orange**: `#f59e0b` to `#d97706`

### Typography
- **Headings**: Raleway font family, bold weights
- **Body**: Ubuntu font family, regular weights
- **Sizes**: Responsive scale from 0.75rem to 2.25rem

### Components Styling
- **Rounded Corners**: 0.75rem to 1rem border radius
- **Shadows**: Layered shadow system for depth
- **Gradients**: Subtle gradients for modern look
- **Animations**: Smooth transitions and hover effects

### Professional Design Features
- **Modern Cards**: Rounded corners, subtle shadows, hover effects
- **Gradient Buttons**: Blue gradient with hover animations
- **Professional Tables**: Clean, modern table design with user avatars
- **Modal System**: Full-screen modals with backdrop blur
- **Badge System**: Color-coded status and role badges

---

## 🧩 Components

### UI Components (Radix UI Based)
- **Button**: Multiple variants (primary, secondary, outline)
- **Card**: Container component with header and content
- **Input**: Form input with validation styling
- **Select**: Dropdown selection component
- **Badge**: Status and category indicators
- **Table**: Data display with sorting and filtering
- **Modal/Dialog**: Overlay components for forms
- **Breadcrumb**: Navigation breadcrumbs

### Business Components
- **DataTable**: Advanced table with search, sort, pagination
- **CreateCollectionPartnerModal**: Multi-step partner registration
- **CreateProcessorModal**: Multi-step processor registration
- **MassBalanceWidget**: Dashboard widget for material balance

### Layout Components
- **MainLayout**: Main application layout wrapper
- **Sidebar**: Navigation sidebar with role-based menu
- **Header**: Top navigation with user profile and notifications

---

## 📄 Pages & Routes

### Public Routes
- `/login` - Authentication page

### Protected Routes
- `/` - Dashboard (overview and metrics)
- `/partners` - Partner management hub
- `/partners/collection` - Collection partners listing
- `/partners/processors` - Processors listing
- `/material-in` - Material collection management
- `/inventory` - Inventory management
- `/material-out` - Material processing
- `/lots` - Lot management
- `/packaging` - Packaging management

### API Routes
- `/api/dashboard` - Dashboard data
- `/api/partners` - Partner CRUD operations
- `/api/inventory` - Inventory data
- `/api/material-in` - Material collection data
- `/api/lots` - Lot management data

---

## 🔄 State Management

### React Query (Server State)
```typescript
// Example: Fetching partners data
const { data: partners, isLoading, refetch } = useQuery({
  queryKey: ['partners', 'collection'],
  queryFn: async () => {
    const res = await fetch('/api/partners?type=COLLECTION');
    return res.json();
  }
});
```

### Zustand (Client State)
- **User State**: Current user information and preferences
- **UI State**: Modal states, sidebar collapse, theme preferences
- **Form State**: Multi-step form progress and data

### React Hook Form (Form State)
```typescript
// Example: Form handling
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

---

## 🔌 API Integration

### API Structure
- **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Responses**: Consistent JSON response format
- **Error Handling**: Standardized error responses
- **Mock Data**: Development-friendly mock data system

### Example API Calls
```typescript
// Fetch inventory data
const fetchInventory = async () => {
  const response = await fetch('/api/inventory');
  if (!response.ok) throw new Error('Failed to fetch inventory');
  return response.json();
};

// Create new partner
const createPartner = async (partnerData: PartnerFormData) => {
  const response = await fetch('/api/partners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partnerData)
  });
  return response.json();
};
```

---

## 🔐 Authentication

### Authentication Flow
1. **Login Page**: Email/password authentication
2. **Role-based Access**: Different permissions per role
3. **Session Management**: Secure session handling
4. **Route Protection**: Protected routes based on authentication

### Implementation
```typescript
// Authentication middleware
export function middleware(request: NextRequest) {
  // Check authentication status
  // Redirect to login if not authenticated
  // Allow access based on user role
}
```

---

## 🚀 Setup & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd TRF-Climaone-main

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run setup    # Install and lint
npm run clean    # Clean and reinstall
```

---

## ⚙️ Environment Configuration

### Environment Variables
```bash
# Authentication
NEXTAUTH_SECRET="demo_secret_key_change_in_production"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"

# Demo Users (JSON format)
DEMO_USERS={"admin@trf.com":{"password":"admin123","role":"ADMIN","name":"Admin User"},...}
```

### Configuration Files
- **next.config.js**: Next.js configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **components.json**: Shadcn/ui configuration

---

## 📊 Key Features Summary

### ✅ Implemented Features
- **Professional Design System**: Modern, consistent UI/UX
- **Role-based Authentication**: Secure access control
- **Partner Management**: Complete partner lifecycle management
- **Material Tracking**: End-to-end material traceability
- **Inventory Management**: Real-time inventory tracking
- **Responsive Design**: Mobile-friendly interface
- **Multi-step Forms**: User-friendly data entry
- **Advanced Tables**: Searchable, sortable data tables
- **Dashboard Analytics**: Visual data representation

### 🔄 System Workflow
1. **Material Collection**: Partners collect textile waste
2. **Material Entry**: Gate operators record incoming materials
3. **Segregation**: SEG users categorize and quality check
4. **Inventory Update**: Materials added to inventory system
5. **Processing**: Materials processed based on type and quality
6. **Packaging**: Processed materials packaged for shipment
7. **Sales**: Materials sold to processors or end customers
8. **Tracking**: Complete traceability throughout the process

---

## 🎯 Developer Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **Component Structure**: Functional components with hooks
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **File Organization**: Feature-based folder structure
- **CSS Classes**: Tailwind utility classes with custom CSS for complex styling

### Best Practices
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Code splitting and lazy loading
- **Error Handling**: Comprehensive error boundaries
- **Testing**: Component and integration testing (to be implemented)

---

## 📞 Support & Maintenance

### For Developers
- **Code Documentation**: Inline comments and JSDoc
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Reusable component system
- **Design Tokens**: Consistent design variables
- **Development Tools**: ESLint, Prettier, TypeScript

### System Maintenance
- **Regular Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor bundle size and performance
- **Security**: Regular security audits
- **Backup**: Regular data backups
- **Documentation**: Keep documentation updated

---

*This documentation provides a comprehensive overview of the TRF Climaone frontend system. For specific implementation details, refer to the source code and inline documentation.*