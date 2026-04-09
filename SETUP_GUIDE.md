# Klaro Frontend - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- TailwindCSS, shadcn/ui components
- Axios, React Query, Zustand
- Form libraries and utilities

### Step 2: Configure Environment (1 minute)
```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_ORIGIN=https://klaro-5mr5.onrender.com
```

### Step 3: Run Development Server (1 minute)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Install shadcn/ui Components (1 minute)
```bash
# Install required UI components
npx shadcn-ui@latest init

# Add specific components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast
```

---

## 📦 What's Included

### ✅ Project Structure
- Complete folder structure with Next.js App Router
- Organized components, pages, and utilities
- TypeScript configuration

### ✅ Type Definitions
All TypeScript types matching backend API:
- `auth.types.ts` - Authentication
- `user.types.ts` - User models
- `group.types.ts` - Group management
- `project.types.ts` - Projects
- `issue.types.ts` - Issues
- `comment.types.ts` - Comments
- `notification.types.ts` - Notifications
- `analytics.types.ts` - Analytics
- `api.types.ts` - API responses

### ✅ API Service Layer
Complete API integration for all backend endpoints:
- `client.ts` - Axios client with JWT interceptors
- `auth.api.ts` - Authentication APIs
- `groups.api.ts` - Group management APIs
- `projects.api.ts` - Project APIs
- `issues.api.ts` - Issue tracking APIs
- `comments.api.ts` - Comment APIs
- `notifications.api.ts` - Notification APIs
- `analytics.api.ts` - Analytics APIs
- `admin.api.ts` - Admin APIs
- `ai.api.ts` - AI integration APIs

### ✅ State Management
- `authStore.ts` - Zustand store for authentication
- `notificationStore.ts` - Zustand store for notifications

### ✅ Utilities
- `cn.ts` - Class name utility
- `formatters.ts` - Date and string formatters
- `validators.ts` - Form validators

### ✅ Configuration
- `constants.ts` - App constants
- `env.ts` - Environment configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration

---

## 🎯 Next Steps

### Phase 1: Build Authentication (Priority: HIGH)
Create these components in `src/components/auth/`:
1. `LoginForm.tsx` - User login
2. `SignupForm.tsx` - User registration
3. `ProtectedRoute.tsx` - Route guard

Create these pages in `src/app/`:
1. `(auth)/login/page.tsx`
2. `(auth)/signup/page.tsx`

### Phase 2: Build Layout (Priority: HIGH)
Create these components in `src/components/layout/`:
1. `Navbar.tsx` - Top navigation
2. `Sidebar.tsx` - Side navigation
3. `DashboardLayout.tsx` - Main layout wrapper

### Phase 3: Build Core Features (Priority: MEDIUM)
Create components for:
1. Groups (`src/components/groups/`)
2. Projects (`src/components/projects/`)
3. Issues (`src/components/issues/`)

### Phase 4: Build Advanced Features (Priority: MEDIUM)
1. Comments system
2. Notifications
3. AI recommendations
4. Kanban board

### Phase 5: Build Analytics & Admin (Priority: LOW)
1. Analytics dashboard
2. Admin panel
3. Charts and graphs

---

## 🔧 Development Workflow

### 1. Start Backend API
```bash
# Make sure backend is running on port 8080
cd ../Klaro-Backend
./gradlew bootRun
```

### 2. Start Frontend Dev Server
```bash
# In Klaro-Front directory
npm run dev
```

### 3. Test API Connection
Create a test page to verify API connection:
```typescript
// src/app/test/page.tsx
'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api/auth.api';

export default function TestPage() {
  const [status, setStatus] = useState('');

  const testConnection = async () => {
    try {
      await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      });
      setStatus('✅ Connected!');
    } catch (error) {
      setStatus('❌ Connection failed');
    }
  };

  return (
    <div className="p-8">
      <button onClick={testConnection}>Test API Connection</button>
      <p>{status}</p>
    </div>
  );
}
```

---

## 📚 Useful Commands

```bash
# Install a new dependency
npm install <package-name>

# Add a new shadcn component
npx shadcn-ui@latest add <component-name>

# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎨 shadcn/ui Components to Install

Run these commands to add UI components as you build:

```bash
# Form components
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group

# Layout components
npx shadcn-ui@latest add card
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add accordion

# Overlay components
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tooltip

# Navigation components
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add navigation-menu

# Data display components
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add progress

# Feedback components
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add skeleton
```

---

## 🐛 Troubleshooting

### Issue: Module not found errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: TypeScript errors
```bash
# Rebuild TypeScript
npm run type-check
```

### Issue: Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

---

## 📖 Documentation

- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Component Guide](./COMPONENT_GUIDE.md)
- [Backend API Documentation](../Klaro-Backend/README.md)

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Dev server running
- [ ] Backend API accessible
- [ ] shadcn/ui initialized
- [ ] TypeScript working
- [ ] Ready to build components!

---

**Happy Coding! 🚀**
