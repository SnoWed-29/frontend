import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipService } from '../../../core/services/internship.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';
import { Internship, Report, Teacher } from '../../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Teacher Dashboard</h1>
        <p class="subtitle">Manage your supervised internships and student reports</p>
      </div>

      <div class="stats-grid" *ngIf="!isLoading && teacherProfile">
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #dbeafe;">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ supervisedInternships.length }}</div>
            <div class="stat-label">Supervised Internships</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #fef3c7;">
            <span style="color: #92400e;">⏳</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingReviews }}</div>
            <div class="stat-label">Pending Reviews</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #e9d5ff;">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ unreadReports }}</div>
            <div class="stat-label">Ungraded Reports</div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading dashboard...</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading && teacherProfile">
        <app-card title="My Supervised Internships">
          <div class="list">
            <div class="list-item" *ngFor="let internship of supervisedInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.title }}</div>
                <div class="item-subtitle">{{ internship.student.firstName }} {{ internship.student.lastName }} - {{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
            <div class="empty" *ngIf="supervisedInternships.length === 0">
              No supervised internships
            </div>
          </div>
        </app-card>

        <app-card title="Reports to Grade">
          <div class="list">
            <div class="list-item" *ngFor="let report of ungradedReports" (click)="navigate('/reports/' + report.id)">
              <div class="item-main">
                <div class="item-title">{{ report.title }}</div>
                <div class="item-subtitle">{{ report.submittedAt | date }}</div>
              </div>
              <app-button size="sm" variant="primary">Grade</app-button>
            </div>
            <div class="empty" *ngIf="ungradedReports.length === 0">
              No reports to grade
            </div>
          </div>
        </app-card>
      </div>

      <div class="error" *ngIf="!isLoading && !teacherProfile">
        <p>Unable to load teacher profile. Please contact administrator.</p>
      </div>
    </div>
  `,
  styleUrl: '../dashboard-shared.css'
})
export class TeacherDashboardComponent implements OnInit {
  teacherProfile: Teacher | null = null;
  supervisedInternships: Internship[] = [];
  ungradedReports: Report[] = [];
  pendingReviews = 0;
  unreadReports = 0;
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private teacherService: TeacherService,
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

    // Get teacher profile by user ID
    this.teacherService.getByUserId(currentUser.id).subscribe({
      next: (teacher) => {
        this.teacherProfile = teacher;
        
        // Load supervised internships
        this.internshipService.getBySupervisor(teacher.id).subscribe({
          next: (internships) => {
            this.supervisedInternships = internships || [];
            this.pendingReviews = internships?.filter(i => i.status === 'PENDING').length || 0;

            // Load reports for supervised internships
            this.loadReports();
          },
          error: (error) => {
            console.error('Error loading internships:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading teacher profile:', error);
        this.isLoading = false;
      }
    });
  }

  loadReports() {
    const reportPromises = this.supervisedInternships.map(internship =>
      this.reportService.getByInternship(internship.id).toPromise()
    );

    Promise.all(reportPromises).then(reportsArrays => {
      const allReports = reportsArrays.flat().filter(r => r != null) as Report[];
      this.ungradedReports = allReports.filter(r => !r.grade);
      this.unreadReports = this.ungradedReports.length;
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
