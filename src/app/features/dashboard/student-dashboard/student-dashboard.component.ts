import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipService } from '../../../core/services/internship.service';
import { StudentService } from '../../../core/services/student.service';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';
import { Internship, Report, Student } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Student Dashboard</h1>
        <p class="subtitle" *ngIf="studentProfile">Welcome, {{ studentProfile.firstName }}!</p>
      </div>

      <div class="stats-grid" *ngIf="!isLoading && studentProfile">
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #dbeafe;">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ myInternships.length }}</div>
            <div class="stat-label">My Internships</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #d1fae5;">
            <span style="color: #065f46;">✓</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ activeInternship ? 1 : 0 }}</div>
            <div class="stat-label">Active Internship</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #e9d5ff;">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ myReports.length }}</div>
            <div class="stat-label">Submitted Reports</div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading dashboard...</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading && studentProfile">
        <app-card title="My Internships">
          <div class="list">
            <div class="list-item" *ngFor="let internship of myInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.title }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
            <div class="empty" *ngIf="myInternships.length === 0">
              No internships yet
            </div>
          </div>
          <div footer style="display: flex; justify-content: flex-end;">
            <app-button variant="primary" size="sm" (click)="navigate('/internships/create')">
              + Add Internship
            </app-button>
          </div>
        </app-card>

        <app-card title="Current Internship" *ngIf="activeInternship">
          <div class="internship-detail">
            <h3>{{ activeInternship.title }}</h3>
            <p class="company">{{ activeInternship.company }}</p>
            <div class="dates">
              <span>{{ activeInternship.startDate | date }} - {{ activeInternship.endDate | date }}</span>
            </div>
            <div class="supervisor" *ngIf="activeInternship.supervisor">
              <strong>Supervisor:</strong> {{ activeInternship.supervisor.firstName }} {{ activeInternship.supervisor.lastName }}
            </div>
          </div>
          <div footer>
            <app-button variant="primary" size="sm" (click)="navigate('/internships/' + activeInternship.id)">
              View Details
            </app-button>
          </div>
        </app-card>

        <app-card title="My Reports" *ngIf="!activeInternship">
          <div class="list">
            <div class="list-item" *ngFor="let report of myReports" (click)="navigate('/reports/' + report.id)">
              <div class="item-main">
                <div class="item-title">{{ report.title }}</div>
                <div class="item-subtitle">{{ report.submittedAt | date }}</div>
              </div>
              <span class="grade" *ngIf="report.grade">Grade: {{ report.grade }}/20</span>
              <span class="pending" *ngIf="!report.grade">Pending</span>
            </div>
            <div class="empty" *ngIf="myReports.length === 0">
              No reports submitted
            </div>
          </div>
        </app-card>

        <app-card title="Profile Information">
          <div class="profile-info">
            <div class="info-row">
              <span class="label">Level:</span>
              <span>{{ studentProfile.level.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span>{{ studentProfile.email }}</span>
            </div>
            <div class="info-row" *ngIf="studentProfile.phone">
              <span class="label">Phone:</span>
              <span>{{ studentProfile.phone }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="error" *ngIf="!isLoading && !studentProfile">
        <p>Unable to load student profile. Please contact administrator.</p>
      </div>
    </div>
  `,
  styleUrl: '../dashboard-shared.css',
  styles: [`
    .internship-detail h3 {
      margin: 0 0 0.5rem 0;
      color: #111827;
    }
    .company {
      color: #6b7280;
      margin: 0 0 1rem 0;
    }
    .dates, .supervisor {
      margin-bottom: 0.5rem;
      color: #374151;
      font-size: 0.875rem;
    }
    .grade {
      font-weight: 600;
      color: #065f46;
    }
    .pending {
      color: #92400e;
      font-style: italic;
    }
    .profile-info .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .profile-info .info-row:last-child {
      border-bottom: none;
    }
    .profile-info .label {
      font-weight: 600;
      color: #374151;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  studentProfile: Student | null = null;
  myInternships: Internship[] = [];
  activeInternship: Internship | null = null;
  myReports: Report[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private internshipService: InternshipService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // Get student profile by user ID
    this.studentService.getByUserId(currentUser.id).subscribe({
      next: (student) => {
        this.studentProfile = student;
        
        // Load student's internships
        this.internshipService.getByStudent(student.id).subscribe({
          next: (internships) => {
            this.myInternships = internships || [];
            this.activeInternship = internships?.find(i => i.status === 'IN_PROGRESS') || null;

            // Load reports for all internships
            this.loadReports();
          },
          error: (error) => {
            console.error('Error loading internships:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
        this.isLoading = false;
      }
    });
  }

  loadReports() {
    const reportPromises = this.myInternships.map(internship =>
      this.reportService.getByInternship(internship.id).toPromise()
    );

    Promise.all(reportPromises).then(reportsArrays => {
      this.myReports = reportsArrays.flat().filter(r => r != null) as Report[];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading reports:', error);
      this.isLoading = false;
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
