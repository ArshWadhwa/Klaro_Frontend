# Klaro Frontend Architecture

## 📋 Overview
This document outlines the frontend architecture for Klaro, designed to work seamlessly with the backend API.

## 🛠 Technology Stack

### Core
- **React 18** with TypeScript
- **Next.js 14** (App Router)
- **TailwindCSS** for styling
- **shadcn/ui** for UI components

### State Management
- **Zustand** for global state
- **React Query (TanStack Query)** for server state & caching

### API & Data
- **Axios** for HTTP requests with interceptors
- **Zod** for runtime validation

### Additional Libraries
- **React Hook Form** for form management
- **date-fns** for date formatting
- **react-hot-toast** for notifications
- **lucide-react** for icons

## 📁 Project Structure

```
Klaro-Front/
├── public/
│   └── assets/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── groups/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [groupId]/
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [projectId]/
│   │   │   ├── issues/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [issueId]/
│   │   │   ├── analytics/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── badge.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── groups/
│   │   │   ├── GroupList.tsx
│   │   │   ├── GroupCard.tsx
│   │   │   ├── CreateGroupDialog.tsx
│   │   │   ├── GroupDetails.tsx
│   │   │   ├── AddMemberDialog.tsx
│   │   │   └── MemberList.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CreateProjectDialog.tsx
│   │   │   ├── ProjectDetails.tsx
│   │   │   └── ProjectStats.tsx
│   │   │
│   │   ├── issues/
│   │   │   ├── IssueList.tsx
│   │   │   ├── IssueCard.tsx
│   │   │   ├── CreateIssueDialog.tsx
│   │   │   ├── IssueDetails.tsx
│   │   │   ├── IssueFilters.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── AIRecommendation.tsx
│   │   │
│   │   ├── comments/
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── AddCommentForm.tsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationItem.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── IssueBreakdownChart.tsx
│   │   │   └── ProjectMetrics.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── UserTable.tsx
│   │   │   └── SystemStats.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── SearchBar.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance with interceptors
│   │   │   ├── auth.api.ts          # Auth endpoints
│   │   │   ├── groups.api.ts        # Group endpoints
│   │   │   ├── projects.api.ts      # Project endpoints
│   │   │   ├── issues.api.ts        # Issue endpoints
│   │   │   ├── comments.api.ts      # Comment endpoints
│   │   │   ├── notifications.api.ts # Notification endpoints
│   │   │   ├── analytics.api.ts     # Analytics endpoints
│   │   │   ├── admin.api.ts         # Admin endpoints
│   │   │   └── ai.api.ts            # AI endpoints
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useGroups.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useIssues.ts
│   │   │   ├── useComments.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useAnalytics.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── authStore.ts         # Zustand auth store
│   │   │   ├── groupStore.ts        # Zustand group store
│   │   │   └── notificationStore.ts # Zustand notification store
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                # Class name utility
│   │       ├── formatters.ts        # Date/string formatters
│   │       └── validators.ts        # Form validators
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── group.types.ts
│   │   ├── project.types.ts
│   │   ├── issue.types.ts
│   │   ├── comment.types.ts
│   │   ├── notification.types.ts
│   │   └── api.types.ts
│   │
│   └── config/
│       ├── constants.ts
│       └── env.ts
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🔑 Key Features by Role

### Admin Features
- ✅ Create and manage groups
- ✅ Add/remove group members
- ✅ Create projects and assign to groups
- ✅ View all users, groups, and projects
- ✅ Access system analytics
- ✅ Manage user roles

### User Features
- ✅ View groups they're members of
- ✅ View projects in their groups
- ✅ Create issues in group projects
- ✅ Comment on issues
- ✅ View assigned issues
- ✅ Get AI recommendations
- ✅ Receive notifications
- ✅ View analytics dashboard

## 📊 Pages Overview

### 1. Authentication Pages
- `/login` - Login form with email/password
- `/signup` - Registration with role selection

### 2. Dashboard Pages
- `/dashboard` - Main dashboard with stats and recent activity
- `/groups` - List all user's groups
- `/groups/[groupId]` - Group details with members and projects
- `/projects` - List all accessible projects
- `/projects/[projectId]` - Project details with issues
- `/issues` - List all issues (with filters)
- `/issues/[issueId]` - Issue details with comments
- `/analytics` - Analytics dashboard
- `/admin` - Admin panel (admin only)

## 🔐 Authentication Flow

1. **Login/Signup** → Get JWT access token + refresh token
2. **Store tokens** in localStorage/cookies
3. **Axios interceptor** adds Bearer token to requests
4. **Token refresh** automatic on 401 responses
5. **Logout** clears tokens and redirects to login

## 🎨 UI/UX Considerations

### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Info: Purple (#8B5CF6)

### Priority Colors
- LOW: Gray
- MEDIUM: Yellow
- HIGH: Red

### Status Colors
- TO_DO: Gray
- IN_PROGRESS: Blue
- DONE: Green

### Type Colors
- BUG: Red
- FEATURE: Purple
- TASK: Blue

## 🚀 Performance Optimizations

1. **React Query** for server state caching
2. **Lazy loading** for routes and heavy components
3. **Debounced search** for filtering
4. **Optimistic updates** for better UX
5. **Pagination** for large lists
6. **Memoization** with useMemo/useCallback

## 🔔 Real-time Features

- **Notification polling** every 30 seconds
- **Unread count** badge on notification bell
- **Toast notifications** for actions
- **Auto-refresh** after mutations

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Collapsible sidebar** on mobile
- **Touch-friendly** buttons and cards

## 🧪 Testing Strategy

- **Unit tests** with Jest + React Testing Library
- **Integration tests** for API calls
- **E2E tests** with Playwright
- **Type safety** with TypeScript

## 🔒 Security Best Practices

1. **XSS Protection** - Sanitize user inputs
2. **CSRF Protection** - Use tokens
3. **Secure token storage** - HttpOnly cookies preferred
4. **Role-based rendering** - Hide admin features from users
5. **Input validation** - Client + server side

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## 🎯 Next Steps

1. Initialize Next.js project with TypeScript
2. Install and configure dependencies
3. Setup shadcn/ui components
4. Create TypeScript types
5. Build API service layer
6. Implement authentication
7. Create page layouts
8. Build feature components
9. Add state management
10. Implement analytics
11. Test and optimize
