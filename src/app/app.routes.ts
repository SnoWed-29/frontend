import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './features/dashboard/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './features/dashboard/student-dashboard/student-dashboard.component';
import { InternshipListComponent } from './features/internships/internship-list/internship-list.component';
import { InternshipDetailComponent } from './features/internships/internship-detail/internship-detail.component';
import { InternshipFormComponent } from './features/internships/internship-form/internship-form.component';
import { StudentListComponent } from './features/students/student-list/student-list.component';
import { StudentDetailComponent } from './features/students/student-detail/student-detail.component';
import { StudentFormComponent } from './features/students/student-form/student-form.component';
import { TeacherListComponent } from './features/teachers/teacher-list/teacher-list.component';
import { TeacherDetailComponent } from './features/teachers/teacher-detail/teacher-detail.component';
import { TeacherFormComponent } from './features/teachers/teacher-form/teacher-form.component';
import { ReportListComponent } from './features/reports/report-list/report-list.component';
import { ReportDetailComponent } from './features/reports/report-detail/report-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
  // Auth routes (public)
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  
  // Dashboard routes (role-specific)
  { 
    path: 'dashboard/admin', 
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  { 
    path: 'dashboard/teacher', 
    component: TeacherDashboardComponent,
    canActivate: [authGuard, roleGuard([UserRole.TEACHER])]
  },
  { 
    path: 'dashboard/student', 
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard([UserRole.STUDENT])]
  },
  { 
    path: 'dashboard', 
    redirectTo: '/dashboard/student', 
    pathMatch: 'full' 
  },
  
  // Internship routes (authenticated users)
  { 
    path: 'internships', 
    component: InternshipListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'internships/create', 
    component: InternshipFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.STUDENT])]
  },
  { 
    path: 'internships/:id', 
    component: InternshipDetailComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'internships/:id/edit', 
    component: InternshipFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT])]
  },
  
  // Student routes (Admin and Teacher can view, Admin can create/edit)
  { 
    path: 'students', 
    component: StudentListComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.TEACHER])]
  },
  { 
    path: 'students/create', 
    component: StudentFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  { 
    path: 'students/:id', 
    component: StudentDetailComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.TEACHER])]
  },
  { 
    path: 'students/:id/edit', 
    component: StudentFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  
  // Teacher routes (Admin only for management)
  { 
    path: 'teachers', 
    component: TeacherListComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  { 
    path: 'teachers/create', 
    component: TeacherFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  { 
    path: 'teachers/:id', 
    component: TeacherDetailComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  { 
    path: 'teachers/:id/edit', 
    component: TeacherFormComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  
  // Report routes (authenticated users)
  { 
    path: 'reports', 
    component: ReportListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reports/:id', 
    component: ReportDetailComponent,
    canActivate: [authGuard]
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];
