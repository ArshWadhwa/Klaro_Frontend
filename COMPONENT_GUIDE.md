# Klaro Frontend - Component Structure Guide

## 📋 Overview
This document provides a detailed breakdown of all components needed for the Klaro frontend application.

---

## 🎨 Component Categories

### 1. Authentication Components (`src/components/auth/`)

#### LoginForm.tsx
**Purpose**: User login form with email and password  
**Features**:
- Email/password input fields
- Form validation
- Error handling
- Remember me checkbox
- Link to signup page

**Props**:
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
}
```

**API Used**: `POST /auth/signin`

---

#### SignupForm.tsx
**Purpose**: User registration form  
**Features**:
- Full name, email, password, confirm password fields
- Role selection (Admin/User)
- Form validation
- Password strength indicator
- Link to login page

**Props**:
```typescript
interface SignupFormProps {
  onSuccess?: () => void;
}
```

**API Used**: `POST /auth/signup`

---

#### ProtectedRoute.tsx
**Purpose**: Route guard for authenticated pages  
**Features**:
- Check authentication status
- Redirect to login if not authenticated
- Show loading state

**Props**:
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_USER';
}
```

---

### 2. Layout Components (`src/components/layout/`)

#### Navbar.tsx
**Purpose**: Top navigation bar  
**Features**:
- App logo and name
- Search bar
- Notification bell with badge
- User profile dropdown
- Logout button

**State Required**:
- Current user info
- Unread notification count

---

#### Sidebar.tsx
**Purpose**: Side navigation menu  
**Features**:
- Navigation links (Dashboard, Groups, Projects, Issues, Analytics)
- Admin section (conditional)
- Active route highlighting
- Collapsible on mobile

**Props**:
```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}
```

---

#### DashboardLayout.tsx
**Purpose**: Main layout wrapper  
**Features**:
- Navbar + Sidebar + Content area
- Responsive design
- Breadcrumbs

**Props**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}
```

---

### 3. Group Components (`src/components/groups/`)

#### GroupList.tsx
**Purpose**: Display list of groups  
**Features**:
- Grid/list view toggle
- Search and filter
- Create group button (admin only)
- Empty state

**API Used**: `GET /groups` or `GET /groups/all`

---

#### GroupCard.tsx
**Purpose**: Individual group card  
**Features**:
- Group name and description
- Member count and project count
- View details button
- Admin actions (edit/delete)

**Props**:
```typescript
interface GroupCardProps {
  group: Group;
  onSelect?: (groupId: number) => void;
}
```

---

#### CreateGroupDialog.tsx
**Purpose**: Modal for creating new group  
**Features**:
- Name and description fields
- Member email input (multiple)
- Form validation
- Success/error feedback

**API Used**: `POST /groups`

---

#### GroupDetails.tsx
**Purpose**: Detailed view of a group  
**Features**:
- Group info
- Member list with avatars
- Project list
- Add/remove members (admin)
- Delete group (admin)

**API Used**: 
- `GET /groups/{groupId}`
- `POST /groups/{groupId}/members`
- `DELETE /groups/{groupId}/members`

---

#### AddMemberDialog.tsx
**Purpose**: Modal to add members to group  
**Features**:
- Search available users
- Multi-select
- Batch add option

**Props**:
```typescript
interface AddMemberDialogProps {
  groupId: number;
  onSuccess?: () => void;
}
```

**API Used**: `POST /groups/{groupId}/members/batch`

---

#### MemberList.tsx
**Purpose**: Display group members  
**Features**:
- Member avatars and names
- Owner badge
- Remove member button (admin)

**Props**:
```typescript
interface MemberListProps {
  members: MemberInfo[];
  groupId: number;
  canManage?: boolean;
}
```

---

### 4. Project Components (`src/components/projects/`)

#### ProjectList.tsx
**Purpose**: Display list of projects  
**Features**:
- Grid/list view
- Filter by group
- Create project button (admin)
- Empty state

**API Used**: `GET /projects`

---

#### ProjectCard.tsx
**Purpose**: Individual project card  
**Features**:
- Project name and description
- Created by info
- Group association
- Issue count
- View details button

**Props**:
```typescript
interface ProjectCardProps {
  project: Project;
  onSelect?: (projectId: number) => void;
}
```

---

#### CreateProjectDialog.tsx
**Purpose**: Modal for creating project  
**Features**:
- Name and description fields
- Group selection dropdown
- Form validation

**API Used**: `POST /projects`

---

#### ProjectDetails.tsx
**Purpose**: Detailed project view  
**Features**:
- Project info
- Issue list
- Stats (total issues, open, in progress, done)
- Create issue button

**API Used**: 
- `GET /projects/{projectId}`
- `GET /api/issues/projects/{projectId}/issues`

---

#### ProjectStats.tsx
**Purpose**: Project statistics widget  
**Features**:
- Issue count by status
- Issue count by priority
- Completion percentage
- Charts (pie/bar)

**Props**:
```typescript
interface ProjectStatsProps {
  projectId: number;
}
```

---

### 5. Issue Components (`src/components/issues/`)

#### IssueList.tsx
**Purpose**: Display list of issues  
**Features**:
- Table/card view toggle
- Filter sidebar
- Sort options
- Pagination

**API Used**: `GET /api/issues/search`

---

#### IssueCard.tsx
**Purpose**: Individual issue card  
**Features**:
- Title and description preview
- Priority, status, type badges
- Assigned user avatar
- Created by and date
- Quick actions (update status/priority)

**Props**:
```typescript
interface IssueCardProps {
  issue: Issue;
  onSelect?: (issueId: number) => void;
  onUpdate?: () => void;
}
```

---

#### CreateIssueDialog.tsx
**Purpose**: Modal for creating issue  
**Features**:
- Title and description
- Priority, status, type selectors
- Project dropdown
- Assignee selection
- Form validation

**API Used**: `POST /api/issues`

---

#### IssueDetails.tsx
**Purpose**: Detailed issue view  
**Features**:
- Full issue information
- Update status/priority
- Reassign issue
- Comment section
- AI recommendation section
- Delete issue

**API Used**: 
- `GET /api/issues/{issueId}`
- `PATCH /api/issues/{issueId}/status`
- `PATCH /api/issues/{issueId}/priority`

---

#### IssueFilters.tsx
**Purpose**: Filter sidebar for issues  
**Features**:
- Status filter (checkboxes)
- Priority filter
- Type filter
- Project filter
- Assignee filter
- Clear all filters button

**Props**:
```typescript
interface IssueFiltersProps {
  onFilterChange: (filters: IssueSearchFilters) => void;
}
```

---

#### KanbanBoard.tsx
**Purpose**: Kanban view of issues  
**Features**:
- Three columns: TO_DO, IN_PROGRESS, DONE
- Drag and drop to update status
- Issue cards
- Column counts

**API Used**: `PATCH /api/issues/{issueId}/status`

---

#### PriorityBadge.tsx
**Purpose**: Visual badge for priority  
**Features**:
- Color-coded badges (LOW=gray, MEDIUM=yellow, HIGH=red)
- Icon indicators

**Props**:
```typescript
interface PriorityBadgeProps {
  priority: IssuePriority;
  size?: 'sm' | 'md' | 'lg';
}
```

---

#### StatusBadge.tsx
**Purpose**: Visual badge for status  
**Features**:
- Color-coded badges (TO_DO=gray, IN_PROGRESS=blue, DONE=green)

**Props**:
```typescript
interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
}
```

---

#### AIRecommendation.tsx
**Purpose**: Display AI-generated recommendations  
**Features**:
- Loading state
- Formatted AI suggestion
- Refresh button
- Copy to clipboard

**Props**:
```typescript
interface AIRecommendationProps {
  issueId: number;
}
```

**API Used**: `GET /api/issues/{issueId}/ai-recommendation`

---

### 6. Comment Components (`src/components/comments/`)

#### CommentList.tsx
**Purpose**: Display issue comments  
**Features**:
- Chronological order
- Author avatars
- Timestamps
- Empty state

**Props**:
```typescript
interface CommentListProps {
  issueId: number;
}
```

**API Used**: `GET /comments/issue/{issueId}`

---

#### CommentItem.tsx
**Purpose**: Individual comment  
**Features**:
- Author name and avatar
- Comment content
- Timestamp (relative)

**Props**:
```typescript
interface CommentItemProps {
  comment: Comment;
}
```

---

#### AddCommentForm.tsx
**Purpose**: Form to add new comment  
**Features**:
- Textarea for content
- Character count
- Submit button
- Auto-resize textarea

**Props**:
```typescript
interface AddCommentFormProps {
  issueId: number;
  onSuccess?: () => void;
}
```

**API Used**: `POST /comments/issue/{issueId}`

---

### 7. Notification Components (`src/components/notifications/`)

#### NotificationBell.tsx
**Purpose**: Notification icon with badge  
**Features**:
- Bell icon
- Unread count badge
- Dropdown on click
- Auto-refresh every 30s

**API Used**: `GET /notifications/unread-count`

---

#### NotificationList.tsx
**Purpose**: List of notifications in dropdown  
**Features**:
- Scrollable list
- Unread indicator
- Mark as read on click
- "View all" link

**API Used**: `GET /notifications/username`

---

#### NotificationItem.tsx
**Purpose**: Individual notification  
**Features**:
- Message text
- Timestamp
- Unread indicator
- Click to mark as read

**Props**:
```typescript
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
}
```

**API Used**: `POST /notifications/{notificationId}/read`

---

### 8. Analytics Components (`src/components/analytics/`)

#### DashboardStats.tsx
**Purpose**: Main dashboard statistics  
**Features**:
- Total projects count
- Total issues count
- Open/completed issues
- High priority issues
- My assigned issues
- Cards with icons

**API Used**: `GET /api/analytics/dashboard`

---

#### IssueBreakdownChart.tsx
**Purpose**: Visual charts for issue breakdown  
**Features**:
- Pie chart for status distribution
- Bar chart for priority distribution
- Donut chart for type distribution

**Props**:
```typescript
interface IssueBreakdownChartProps {
  projectId?: number;
}
```

---

#### ProjectMetrics.tsx
**Purpose**: Project-specific metrics  
**Features**:
- Completion rate
- Issue velocity
- Team performance

**Props**:
```typescript
interface ProjectMetricsProps {
  projectId: number;
}
```

---

### 9. Admin Components (`src/components/admin/`)

#### UserManagement.tsx
**Purpose**: User management panel  
**Features**:
- User list table
- Search users
- Filter by role
- User actions

**API Used**: `GET /admin/users`

---

#### UserTable.tsx
**Purpose**: Table displaying users  
**Features**:
- Email, name, role columns
- Sort by columns
- Role badges
- Actions column

**Props**:
```typescript
interface UserTableProps {
  users: User[];
}
```

---

#### SystemStats.tsx
**Purpose**: System-wide statistics  
**Features**:
- Total users
- Total groups
- Total projects
- Total issues
- System health indicators

**API Used**: `GET /admin/stats`

---

### 10. Common/Shared Components (`src/components/common/`)

#### LoadingSpinner.tsx
**Purpose**: Loading indicator  
**Features**:
- Animated spinner
- Optional text
- Size variants

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```

---

#### ErrorBoundary.tsx
**Purpose**: Error boundary wrapper  
**Features**:
- Catch React errors
- Display fallback UI
- Error reporting

---

#### EmptyState.tsx
**Purpose**: Empty state display  
**Features**:
- Icon
- Title and description
- Call-to-action button

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

#### SearchBar.tsx
**Purpose**: Search input component  
**Features**:
- Search icon
- Debounced input
- Clear button

**Props**:
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}
```

---

#### ConfirmDialog.tsx
**Purpose**: Confirmation modal  
**Features**:
- Title and message
- Confirm/cancel buttons
- Danger variant for destructive actions

**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'default' | 'danger';
}
```

---

## 📊 Component Dependency Map

```
App
├── DashboardLayout
│   ├── Navbar
│   │   ├── SearchBar
│   │   ├── NotificationBell
│   │   │   └── NotificationList
│   │   │       └── NotificationItem
│   │   └── UserProfileDropdown
│   ├── Sidebar
│   └── Content Area
│       ├── Dashboard Page
│       │   ├── DashboardStats
│       │   └── IssueBreakdownChart
│       ├── Groups Page
│       │   ├── GroupList
│       │   │   ├── GroupCard
│       │   │   └── CreateGroupDialog
│       │   └── GroupDetails
│       │       ├── MemberList
│       │       └── AddMemberDialog
│       ├── Projects Page
│       │   ├── ProjectList
│       │   │   ├── ProjectCard
│       │   │   └── CreateProjectDialog
│       │   └── ProjectDetails
│       │       ├── ProjectStats
│       │       └── IssueList
│       ├── Issues Page
│       │   ├── IssueFilters
│       │   ├── KanbanBoard / IssueList
│       │   │   └── IssueCard
│       │   │       ├── StatusBadge
│       │   │       └── PriorityBadge
│       │   └── IssueDetails
│       │       ├── AIRecommendation
│       │       ├── CommentList
│       │       │   └── CommentItem
│       │       └── AddCommentForm
│       ├── Analytics Page
│       │   ├── DashboardStats
│       │   ├── IssueBreakdownChart
│       │   └── ProjectMetrics
│       └── Admin Page
│           ├── UserManagement
│           │   └── UserTable
│           └── SystemStats
```

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Setup project structure
2. ✅ TypeScript types
3. ✅ API service layer
4. ✅ State management
5. Authentication components
6. Layout components

### Phase 2: Core Features (Week 2)
7. Group components
8. Project components
9. Issue components (basic)

### Phase 3: Advanced Features (Week 3)
10. Comment system
11. Notification system
12. AI recommendation
13. Kanban board

### Phase 4: Analytics & Admin (Week 4)
14. Analytics dashboard
15. Admin panel
16. Charts and graphs

### Phase 5: Polish & Testing (Week 5)
17. Error handling
18. Loading states
19. Empty states
20. Responsive design
21. Testing

---

## 🎨 Design Guidelines

### Colors
- **Primary**: Blue (#3B82F6) - Actions, links
- **Success**: Green (#10B981) - Success states, DONE status
- **Warning**: Yellow (#F59E0B) - MEDIUM priority
- **Error**: Red (#EF4444) - Errors, HIGH priority, BUG type
- **Info**: Purple (#8B5CF6) - FEATURE type

### Typography
- **Headings**: Inter/SF Pro (bold)
- **Body**: Inter/SF Pro (regular)
- **Code**: JetBrains Mono

### Spacing
- Use Tailwind spacing scale (4px base unit)
- Consistent padding/margin

### Components
- Use shadcn/ui for base components
- Customize with Tailwind classes
- Maintain consistent border radius (0.5rem)

---

## 🔧 Custom Hooks Needed

### useAuth
- Get current user
- Check authentication
- Login/logout
- Check admin role

### useGroups
- Fetch user groups
- Create/update/delete group
- Add/remove members

### useProjects
- Fetch user projects
- Create project
- Get project details

### useIssues
- Fetch issues with filters
- Create/update/delete issue
- Update status/priority
- Search issues

### useComments
- Fetch comments for issue
- Add comment

### useNotifications
- Fetch notifications
- Get unread count
- Mark as read
- Auto-refresh

### useAnalytics
- Fetch dashboard stats
- Fetch project analytics

---

## 📝 Notes

- All forms use `react-hook-form` + `zod` validation
- All API calls use `@tanstack/react-query` for caching
- All modals use `@radix-ui/react-dialog`
- All toasts use `react-hot-toast`
- All dates formatted with `date-fns`
- All charts use `recharts`

---

**Ready to implement! 🚀**
