import { Component, OnInit } from '@angular/core';
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
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Complete system overview and management</p>
      </div>

      <div class="stats-grid" *ngIf="!isLoading">
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

      <div class="loading" *ngIf="isLoading">
        <p>Loading dashboard...</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading">
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
            <div class="empty" *ngIf="recentInternships.length === 0">
              No internships found
            </div>
          </div>
        </app-card>

        <app-card title="Pending Approvals">
          <div class="list">
            <div class="list-item" *ngFor="let internship of pendingInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.title }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <app-button size="sm" variant="primary">Review</app-button>
            </div>
            <div class="empty" *ngIf="pendingInternships.length === 0">
              No pending approvals
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
  styleUrl: '../dashboard-shared.css'
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
    private reportService: ReportService
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
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
