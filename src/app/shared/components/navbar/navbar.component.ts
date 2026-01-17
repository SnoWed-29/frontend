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
      <div class="navbar-container">
        <div class="navbar-brand">
          <a [routerLink]="dashboardLink" class="brand-link">
            <div class="brand-icon">🎓</div>
            <span class="brand-text">InternTrack</span>
          </a>
        </div>
        
        <div class="navbar-menu">
          <a [routerLink]="dashboardLink" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <span class="nav-icon">📊</span>
            Dashboard
          </a>
          <a routerLink="/internships" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📋</span>
            Internships
          </a>
          <a routerLink="/students" routerLinkActive="active" class="nav-link" *ngIf="canViewStudents">
            <span class="nav-icon">👨‍🎓</span>
            Students
          </a>
          <a routerLink="/teachers" routerLinkActive="active" class="nav-link" *ngIf="isAdmin">
            <span class="nav-icon">👨‍🏫</span>
            Teachers
          </a>
          <a routerLink="/reports" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📝</span>
            Reports
          </a>
        </div>
        
        <div class="navbar-user">
          <div class="user-info">
            <div class="user-avatar">{{ getInitials() }}</div>
            <div class="user-details">
              <span class="user-name">{{ currentUserName }}</span>
              <span class="user-role">{{ currentUserRole }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Logout">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.2);
    }
    
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 4.5rem;
    }
    
    .navbar-brand {
      flex-shrink: 0;
    }
    
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: transform 0.2s ease;
    }
    
    .brand-link:hover {
      transform: scale(1.02);
    }
    
    .brand-icon {
      font-size: 1.75rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .brand-text {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.025em;
    }
    
    .navbar-menu {
      display: flex;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 500;
      padding: 0.625rem 1rem;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      font-size: 0.9375rem;
    }
    
    .nav-icon {
      font-size: 1rem;
      opacity: 0.8;
    }
    
    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .nav-link.active {
      color: white;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    }
    
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.4);
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      color: white;
      font-weight: 600;
      font-size: 0.9375rem;
      line-height: 1.2;
    }
    
    .user-role {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
      text-transform: capitalize;
    }
    
    .logout-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.625rem;
      border-radius: 0.75rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logout-btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }
    
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.4);
      color: white;
      transform: scale(1.05);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    
    @media (max-width: 1024px) {
      .navbar-container {
        padding: 0 1rem;
      }
      
      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }
      
      .nav-link span:last-child {
        display: none;
      }
      
      .user-details {
        display: none;
      }
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
      this.currentUserName = user.firstName + ' ' + user.lastName;
      this.currentUserRole = user.role.toLowerCase();
      this.dashboardLink = this.authService.getDashboardRoute();
      this.isAdmin = user.role === UserRole.ADMIN;
      this.canViewStudents = user.role === UserRole.ADMIN || user.role === UserRole.TEACHER;
    }
  }

  getInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
  }
}
