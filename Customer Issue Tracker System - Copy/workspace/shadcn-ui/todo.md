# Customer Issue and Tracking System for Federal Housing - MVP Todo

## Project Overview
A comprehensive issue tracking system with user and admin interfaces for federal housing complaints and maintenance requests.

## Core Files to Create/Modify (Max 8 files):

### 1. src/pages/Index.tsx
- Landing page with login/register options
- Route to user dashboard or admin dashboard based on role

### 2. src/pages/UserDashboard.tsx
- User interface to submit new issues
- View submitted issues and their status
- Track issue progress

### 3. src/pages/AdminDashboard.tsx
- Admin interface with issue management
- Dashboard with statistics and analytics
- Manage all user issues

### 4. src/components/IssueForm.tsx
- Form component for submitting new issues
- Categories: Maintenance, Utilities, Safety, Other
- Priority levels: Low, Medium, High, Critical

### 5. src/components/IssueList.tsx
- Reusable component to display issues
- Different views for user vs admin
- Status tracking and updates

### 6. src/components/AuthForm.tsx
- Login and registration forms
- Role-based authentication (user/admin)

### 7. src/lib/mockData.ts
- Mock data for issues, users, and categories
- Simulates backend API responses

### 8. src/App.tsx (modify)
- Add routing for all pages
- Authentication context

## Key Features:
- User authentication (mock)
- Issue submission with categories and priorities
- Status tracking (Submitted, In Progress, Resolved, Closed)
- Admin dashboard with issue management
- Responsive design with Shadcn-UI components

## Implementation Strategy:
- Use localStorage for data persistence (simulating backend)
- Mock authentication system
- Focus on UI/UX and core functionality
- Modern, professional design suitable for government use