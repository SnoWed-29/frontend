import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Dashboard</h1>
        <p class="subtitle">Welcome back! Here's an overview of your internship management system.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" (click)="navigate('/internships')">
          <div class="stat-icon" style="background-color: #dbeafe;">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalInternships }}</div>
            <div class="stat-label">Total Internships</div>
          </div>
        </div>

        <div class="stat-card" (click)="navigate('/students')">
          <div class="stat-icon" style="background-color: #d1fae5;">
            <span style="color: #065f46;">👨‍🎓</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalStudents }}</div>
            <div class="stat-label">Total Students</div>
          </div>
        </div>

        <div class="stat-card" (click)="navigate('/teachers')">
          <div class="stat-icon" style="background-color: #fef3c7;">
            <span style="color: #92400e;">👨‍🏫</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalTeachers }}</div>
            <div class="stat-label">Total Teachers</div>
          </div>
        </div>

        <div class="stat-card" (click)="navigate('/reports')">
          <div class="stat-icon" style="background-color: #e9d5ff;">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalReports }}</div>
            <div class="stat-label">Total Reports</div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <app-card title="Recent Internships">
          <div class="list">
            <div class="list-item" *ngFor="let internship of recentInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.title }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
          </div>
        </app-card>

        <app-card title="Pending Actions">
          <div class="list">
            <div class="list-item" *ngFor="let action of pendingActions">
              <div class="item-main">
                <div class="item-title">{{ action.title }}</div>
                <div class="item-subtitle">{{ action.description }}</div>
              </div>
              <app-button size="sm" variant="primary" (click)="handleAction(action)">
                View
              </app-button>
            </div>
          </div>
        </app-card>

        <app-card title="Internship Status Overview">
          <div class="status-overview">
            <div class="status-item">
              <span class="status-label">Pending</span>
              <span class="status-count">{{ statusCounts.pending }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Approved</span>
              <span class="status-count">{{ statusCounts.approved }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">In Progress</span>
              <span class="status-count">{{ statusCounts.inProgress }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">Completed</span>
              <span class="status-count">{{ statusCounts.completed }}</span>
            </div>
          </div>
        </app-card>

        <app-card title="Quick Actions">
          <div class="quick-actions">
            <app-button variant="primary" (click)="navigate('/internships/create')">
              + New Internship
            </app-button>
            <app-button variant="success" (click)="navigate('/students/create')">
              + New Student
            </app-button>
            <app-button variant="secondary" (click)="navigate('/teachers/create')">
              + New Teacher
            </app-button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }
    .subtitle {
      color: #6b7280;
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
    }
    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .list-item {
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.375rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .list-item:hover {
      background-color: #f3f4f6;
    }
    .item-title {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }
    .item-subtitle {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .status-approved {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-in_progress {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .status-completed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-overview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background-color: #f9fafb;
      border-radius: 0.375rem;
    }
    .status-label {
      font-weight: 500;
      color: #374151;
    }
    .status-count {
      font-weight: 700;
      color: #111827;
      font-size: 1.25rem;
    }
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `]
})
export class DashboardComponent {
  stats = {
    totalInternships: 25,
    totalStudents: 48,
    totalTeachers: 12,
    totalReports: 37
  };

  recentInternships = [
    { id: 1, title: 'Full Stack Developer', company: 'Tech Corp', status: 'IN_PROGRESS' },
    { id: 2, title: 'Frontend Developer', company: 'Design Studio', status: 'APPROVED' },
    { id: 3, title: 'Data Analyst', company: 'Analytics Inc', status: 'PENDING' }
  ];

  pendingActions = [
    { id: 1, title: 'Review Internship Application', description: 'John Doe - Full Stack Developer', type: 'internship' },
    { id: 2, title: 'Grade Report', description: 'Monthly Progress Report - February', type: 'report' },
    { id: 3, title: 'Approve Student Registration', description: 'New student waiting for approval', type: 'student' }
  ];

  statusCounts = {
    pending: 5,
    approved: 8,
    inProgress: 10,
    completed: 2
  };

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  handleAction(action: any) {
    console.log('Handle action:', action);
  }
}
