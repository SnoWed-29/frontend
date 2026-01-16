# Frontend Application Structure

This Angular application follows a modular architecture with clear separation of concerns.

## 📁 Project Structure

```
src/app/
├── core/                    # Singleton services & core functionality
│   ├── guards/             # Route guards (auth, roles)
│   ├── interceptors/       # HTTP interceptors
│   ├── services/           # Core services (API, auth)
│   └── models/             # TypeScript interfaces
│       ├── user.model.ts
│       ├── student.model.ts
│       ├── teacher.model.ts
│       ├── internship.model.ts
│       ├── report.model.ts
│       ├── level.model.ts
│       └── sector.model.ts
│
├── shared/                  # Reusable UI components
│   ├── components/
│   │   ├── button/
│   │   ├── card/
│   │   ├── table/
│   │   ├── input/
│   │   ├── navbar/
│   │   └── modal/
│   ├── directives/
│   └── pipes/
│
└── features/                # Feature modules
    ├── auth/
    │   ├── login/
    │   └── register/
    ├── dashboard/
    ├── internships/
    │   ├── internship-list/
    │   ├── internship-detail/
    │   └── internship-form/
    ├── students/
    │   ├── student-list/
    │   ├── student-detail/
    │   └── student-form/
    ├── teachers/
    │   ├── teacher-list/
    │   ├── teacher-detail/
    │   └── teacher-form/
    └── reports/
        ├── report-list/
        └── report-detail/
```

## 🎯 Features Created

### Authentication
- **Login Page** (`/auth/login`) - User authentication
- **Register Page** (`/auth/register`) - New user registration

### Dashboard
- **Dashboard** (`/dashboard`) - Overview with statistics and recent activity

### Internships Management
- **List View** (`/internships`) - View all internships
- **Detail View** (`/internships/:id`) - View internship details
- **Create/Edit Form** (`/internships/create`, `/internships/:id/edit`) - Manage internships

### Students Management
- **List View** (`/students`) - View all students
- **Detail View** (`/students/:id`) - View student details
- **Create/Edit Form** (`/students/create`, `/students/:id/edit`) - Manage students

### Teachers Management
- **List View** (`/teachers`) - View all teachers
- **Detail View** (`/teachers/:id`) - View teacher details
- **Create/Edit Form** (`/teachers/create`, `/teachers/:id/edit`) - Manage teachers

### Reports Management
- **List View** (`/reports`) - View all reports
- **Detail View** (`/reports/:id`) - View report details

## 🧩 Shared Components

All components are standalone and can be used across the application:

- **Button** - Reusable button with variants (primary, secondary, success, danger)
- **Card** - Container component with header and footer
- **Table** - Data table with sorting and actions
- **Input** - Form input with validation
- **Navbar** - Top navigation bar
- **Modal** - Popup dialog component

## 📊 Models

All TypeScript interfaces are defined in `core/models/`:

- **User** - User account with roles (ADMIN, TEACHER, STUDENT)
- **Student** - Student profile with level
- **Teacher** - Teacher profile with sector
- **Internship** - Internship with status tracking
- **Report** - Internship reports with grading
- **Level** - Academic levels (BAC_1 to BAC_5)
- **Sector** - Academic sectors (INFORMATIQUE, MARKETING, etc.)

## 🚀 Running the Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
ng serve

# Open browser
http://localhost:4200
```

The app will start on the login page. All data is currently static (mock data).

## 🔄 Routes

```
/ → Redirects to /auth/login
/auth/login → Login page
/auth/register → Register page
/dashboard → Dashboard (requires login)
/internships → Internships list
/internships/create → Create internship
/internships/:id → Internship details
/internships/:id/edit → Edit internship
/students → Students list
/students/create → Create student
/students/:id → Student details
/students/:id/edit → Edit student
/teachers → Teachers list
/teachers/create → Create teacher
/teachers/:id → Teacher details
/teachers/:id/edit → Edit teacher
/reports → Reports list
/reports/:id → Report details
```

## 📝 Next Steps

To connect to the backend API:

1. Create services in `core/services/` (e.g., `internship.service.ts`)
2. Implement HTTP calls using HttpClient
3. Add authentication interceptor for JWT tokens
4. Add route guards to protect routes
5. Replace mock data with API calls
6. Add error handling and loading states

## 🎨 Styling

The application uses:
- Custom CSS components (no external UI library)
- Responsive design
- Consistent color scheme
- Modern UI patterns

All styles are scoped to components for better maintainability.
