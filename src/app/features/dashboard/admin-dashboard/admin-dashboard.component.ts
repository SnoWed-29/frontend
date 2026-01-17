import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipService } from '../../../core/services/internship.service';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ReportService } from '../../../core/services/report.service';
import { Internship, Student, Teacher, Report } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <p class="subtitle">Complete system overview and management</p>
        </div>
        <div class="header-badge">
          <span class="badge-icon">👑</span>
          <span class="badge-text">Administrator</span>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!isLoading">
        <div class="stat-card stat-internships" (click)="navigate('/internships')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalInternships }}</div>
            <div class="stat-label">Total Internships</div>
          </div>
        </div>

        <div class="stat-card stat-students" (click)="navigate('/students')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);">
            <span style="color: #065f46;">👨‍🎓</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalStudents }}</div>
            <div class="stat-label">Total Students</div>
          </div>
        </div>

        <div class="stat-card stat-teachers" (click)="navigate('/teachers')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
            <span style="color: #92400e;">👨‍🏫</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalTeachers }}</div>
            <div class="stat-label">Total Teachers</div>
          </div>
        </div>

        <div class="stat-card stat-reports" (click)="navigate('/reports')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalReports }}</div>
            <div class="stat-label">Total Reports</div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading dashboard data</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading">
        <app-card title="Recent Internships" icon="📋">
          <div class="list">
            <div class="list-item" *ngFor="let internship of recentInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.subject }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
            <div class="empty" *ngIf="recentInternships.length === 0">
              <span>📭</span> No internships found
            </div>
          </div>
        </app-card>

        <app-card title="Pending Approvals" icon="⏳">
          <div class="list">
            <div class="list-item" *ngFor="let internship of pendingInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.subject }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <app-button size="sm" variant="primary">Review</app-button>
            </div>
            <div class="empty" *ngIf="pendingInternships.length === 0">
              <span>✅</span> No pending approvals
            </div>
          </div>
        </app-card>

        <app-card title="Quick Actions" icon="⚡">
          <div class="quick-actions">
            <app-button variant="success" (click)="navigate('/students/create')">
              👨‍🎓 Add New Student
            </app-button>
            <app-button variant="secondary" (click)="navigate('/teachers/create')">
              👨‍🏫 Add New Teacher
            </app-button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1500px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      animation: slideInLeft 0.5s ease-out;
    }
    
    .header-content h1 {
      font-size: 2.25rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }
    
    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1.0625rem;
    }
    
    .header-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 9999px;
      border: 2px solid #fbbf24;
    }
    
    .badge-icon { font-size: 1.25rem; }
    .badge-text { font-weight: 700; color: #92400e; font-size: 0.875rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
      display: flex;
      align-items: center;
      gap: 1.25rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(226, 232, 240, 0.8);
      animation: fadeInUp 0.5s ease-out backwards;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    }
    
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }
    
    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
    }
    
    .stat-label {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 1.5rem;
    }
    
    .list { display: flex; flex-direction: column; gap: 0.75rem; }
    
    .list-item {
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    
    .list-item:hover {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      border-color: #c7d2fe;
      transform: translateX(4px);
    }
    
    .item-title { font-weight: 600; color: #1e293b; margin-bottom: 0.25rem; }
    .item-subtitle { color: #64748b; font-size: 0.8125rem; }
    
    .status-badge {
      padding: 0.375rem 0.875rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .status-pending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
    .status-approved { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
    .status-in_progress { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; }
    .status-draft { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #64748b; }
    
    .quick-actions { display: flex; flex-direction: column; gap: 0.75rem; }
    
    .loading { text-align: center; padding: 3rem; color: #64748b; }
    .empty { text-align: center; padding: 2rem; color: #94a3b8; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalInternships: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalReports: 0
  };

  recentInternships: Internship[] = [];
  pendingInternships: Internship[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private internshipService: InternshipService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Load all data in parallel
    Promise.all([
      this.internshipService.getAll().toPromise(),
      this.studentService.getAll().toPromise(),
      this.teacherService.getAll().toPromise(),
      this.reportService.getAll().toPromise()
    ]).then(([internships, students, teachers, reports]) => {
      this.stats.totalInternships = internships?.length || 0;
      this.stats.totalStudents = students?.length || 0;
      this.stats.totalTeachers = teachers?.length || 0;
      this.stats.totalReports = reports?.length || 0;

      this.recentInternships = (internships || []).slice(0, 5);
      this.pendingInternships = (internships || []).filter(i => i.status === 'PENDING');

      this.isLoading = false;
      this.cdr.markForCheck();
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
