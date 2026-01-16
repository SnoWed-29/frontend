import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a [routerLink]="dashboardLink">Internship Manager</a>
      </div>
      <div class="navbar-menu">
        <a [routerLink]="dashboardLink" routerLinkActive="active">Dashboard</a>
        <a routerLink="/internships" routerLinkActive="active">Internships</a>
        <a routerLink="/students" routerLinkActive="active" *ngIf="canViewStudents">Students</a>
        <a routerLink="/teachers" routerLinkActive="active" *ngIf="isAdmin">Teachers</a>
        <a routerLink="/reports" routerLinkActive="active">Reports</a>
      </div>
      <div class="navbar-user">
        <span class="user-name">{{ currentUserName }}</span>
        <span class="user-role">{{ currentUserRole }}</span>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #1f2937;
      padding: 1rem 2rem;
      color: white;
    }
    .navbar-brand a {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    .navbar-menu {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }
    .navbar-menu a {
      color: #d1d5db;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .navbar-menu a:hover,
    .navbar-menu a.active {
      color: white;
    }
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-name {
      color: white;
      font-weight: 500;
    }
    .user-role {
      color: #d1d5db;
      font-size: 0.875rem;
      text-transform: capitalize;
      padding: 0.25rem 0.75rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
    }
    .logout-btn {
      background-color: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .logout-btn:hover {
      background-color: #dc2626;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUserName = '';
  currentUserRole = '';
  dashboardLink = '/dashboard';
  isAdmin = false;
  canViewStudents = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserName = user.username;
      this.currentUserRole = user.role.toLowerCase();
      this.dashboardLink = this.authService.getDashboardRoute();
      this.isAdmin = user.role === UserRole.ADMIN;
      this.canViewStudents = user.role === UserRole.ADMIN || user.role === UserRole.TEACHER;
    }
  }

  logout() {
    this.authService.logout();
  }
}
