# Klaro Frontend

AI-Powered Issue Tracker for Development Teams - Frontend Application

## 🚀 Overview

Klaro Frontend is a modern, responsive web application built with Next.js 14, TypeScript, and TailwindCSS. It provides a comprehensive interface for managing projects, tracking issues, collaborating with teams, and leveraging AI-powered recommendations.

## ✨ Features

### 🔐 Authentication & Authorization
- User login and registration
- JWT-based authentication with automatic token refresh
- Role-based access control (Admin/User)
- Protected routes

### 👥 Group Management
- Create and manage collaborative groups
- Add/remove members
- Search groups
- View group details with member lists

### 📊 Project Management
- Create projects and associate with groups
- View project details and statistics
- Track project progress

### 🎯 Issue Tracking
- Full CRUD operations for issues
- Priority levels (LOW, MEDIUM, HIGH)
- Status tracking (TO_DO, IN_PROGRESS, DONE)
- Issue types (BUG, FEATURE, TASK)
- Kanban board view
- Advanced filtering and search
- Issue assignment

### 💬 Collaboration
- Comment on issues
- Real-time notifications
- Team communication

### 🤖 AI Integration
- AI-powered issue recommendations
- Intelligent analysis and suggestions

### 📈 Analytics Dashboard
- Project statistics
- Issue breakdown by status, priority, and type
- Visual charts and graphs
- Team performance metrics

### 👑 Admin Features
- User management
- System statistics
- Global access to all resources

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📁 Project Structure

```
Klaro-Front/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   ├── groups/            # Group management
│   │   ├── projects/          # Project management
│   │   ├── issues/            # Issue tracking
│   │   ├── comments/          # Comment system
│   │   ├── notifications/     # Notifications
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── admin/             # Admin panel
│   │   ├── ui/                # shadcn/ui components
│   │   └── common/            # Shared components
│   ├── lib/
│   │   ├── api/               # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── stores/            # Zustand stores
│   │   └── utils/             # Utility functions
│   ├── types/                 # TypeScript types
│   └── config/                # Configuration
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:8080`

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Klaro-Front
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_ORIGIN=https://klaro-5mr5.onrender.com
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📚 Documentation

- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - Detailed architecture overview
- [Component Guide](./COMPONENT_GUIDE.md) - Complete component documentation
- [API Types](./src/types/) - TypeScript type definitions

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components. To add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add card
```

## 🔑 API Integration

All API calls are centralized in `src/lib/api/`:

- `auth.api.ts` - Authentication endpoints
- `groups.api.ts` - Group management
- `projects.api.ts` - Project management
- `issues.api.ts` - Issue tracking
- `comments.api.ts` - Comment system
- `notifications.api.ts` - Notifications
- `analytics.api.ts` - Analytics
- `admin.api.ts` - Admin functions
- `ai.api.ts` - AI integration

The Axios client (`client.ts`) handles:
- Automatic JWT token injection
- Token refresh on 401 errors
- Request/response interceptors
- Error handling

## 🎯 Key Features Implementation

### Authentication Flow

1. User logs in → receives JWT tokens
2. Tokens stored in localStorage
3. Axios interceptor adds token to requests
4. Automatic token refresh on expiry
5. Redirect to login on auth failure

### State Management

**Zustand Stores**:
- `authStore` - User authentication state
- `notificationStore` - Notification management

**React Query**:
- Server state caching
- Automatic refetching
- Optimistic updates
- Background synchronization

### Routing

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/groups` - Groups list (protected)
- `/groups/[id]` - Group details (protected)
- `/projects` - Projects list (protected)
- `/projects/[id]` - Project details (protected)
- `/issues` - Issues list (protected)
- `/issues/[id]` - Issue details (protected)
- `/analytics` - Analytics dashboard (protected)
- `/admin` - Admin panel (admin only)

## 🔒 Security

- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes
- XSS protection
- Input validation

## 🎨 Theming

The application uses a customizable theme system with CSS variables. Colors are defined in `app/globals.css` and can be easily modified.

### Color Scheme

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Purple (#8B5CF6)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Collapsible sidebar on mobile
- Touch-friendly UI elements

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Document complex logic

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
- Ensure backend is running on `http://localhost:8080`
- Check `.env.local` configuration
- Verify CORS settings on backend

**2. Authentication Issues**
- Clear localStorage
- Check token expiration
- Verify JWT secret matches backend

**3. Build Errors**
- Delete `.next` folder and rebuild
- Clear node_modules and reinstall
- Check for TypeScript errors

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- All contributors and supporters

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

**Version**: 1.0.0 | **Last Updated**: November 2025
