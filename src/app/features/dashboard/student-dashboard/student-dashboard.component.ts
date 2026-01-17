import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        <div class="header-content">
          <h1>Student Dashboard</h1>
          <p class="subtitle" *ngIf="studentProfile">Welcome back, {{ studentProfile.user?.firstName }}! 👋</p>
        </div>
        <div class="header-badge">
          <span class="badge-icon">🎓</span>
          <span class="badge-text">Student</span>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!isLoading && studentProfile">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ myInternships.length }}</div>
            <div class="stat-label">My Internships</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);">
            <span style="color: #065f46;">✓</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ activeInternship ? 1 : 0 }}</div>
            <div class="stat-label">Active Internship</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ myReports.length }}</div>
            <div class="stat-label">Submitted Reports</div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading your dashboard</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading && studentProfile">
        <app-card title="My Internships" icon="📋">
          <div class="list">
            <div class="list-item" *ngFor="let internship of myInternships" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.subject }}</div>
                <div class="item-subtitle">{{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
            <div class="empty" *ngIf="myInternships.length === 0">
              <span>📭</span> No internships yet
            </div>
          </div>
          <div footer style="display: flex; justify-content: flex-end;">
            <app-button variant="primary" size="sm" (click)="navigate('/internships/create')">
              ➕ Add Internship
            </app-button>
          </div>
        </app-card>

        <app-card title="Current Internship" icon="🎯" *ngIf="activeInternship">
          <div class="internship-detail">
            <h3>{{ activeInternship.subject }}</h3>
            <p class="company">🏢 {{ activeInternship.company }}</p>
            <div class="dates">
              <span>📅 {{ activeInternship.startDate | date }} - {{ activeInternship.endDate | date }}</span>
            </div>
            <div class="supervisor" *ngIf="activeInternship.teacher">
              <span>👨‍🏫 Supervisor:</span> {{ activeInternship.teacher.user?.firstName }} {{ activeInternship.teacher.user?.lastName }}
            </div>
          </div>
          <div footer>
            <app-button variant="primary" size="sm" (click)="navigate('/internships/' + activeInternship.id)">
              View Details →
            </app-button>
          </div>
        </app-card>

        <app-card title="My Reports" icon="📝" *ngIf="!activeInternship">
          <div class="list">
            <div class="list-item" *ngFor="let report of myReports" (click)="downloadReport(report)">
              <div class="item-main">
                <div class="item-title">{{ report.internship?.subject || 'Report' }}</div>
                <div class="item-subtitle">{{ report.uploadedAt | date }}</div>
              </div>
              <span class="grade" *ngIf="report.grade">🏆 {{ report.grade }}/20</span>
              <span class="pending" *ngIf="!report.grade">⏳ Pending</span>
            </div>
            <div class="empty" *ngIf="myReports.length === 0">
              <span>📭</span> No reports submitted
            </div>
          </div>
        </app-card>

        <app-card title="Profile Information" icon="👤">
          <div class="profile-info">
            <div class="info-row">
              <span class="label">📚 Level</span>
              <span class="value">{{ studentProfile.level?.name }}</span>
            </div>
            <div class="info-row" *ngIf="studentProfile.sector">
              <span class="label">🎯 Sector</span>
              <span class="value">{{ studentProfile.sector.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">📧 Email</span>
              <span class="value">{{ studentProfile.user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">📅 Academic Year</span>
              <span class="value">{{ studentProfile.academicYear }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="error" *ngIf="!isLoading && !studentProfile">
        <p>⚠️ Unable to load student profile. Please contact administrator.</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1400px;
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
    
    .subtitle { color: #64748b; margin: 0; font-size: 1.0625rem; }
    
    .header-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-radius: 9999px;
      border: 2px solid #60a5fa;
    }
    
    .badge-icon { font-size: 1.25rem; }
    .badge-text { font-weight: 700; color: #1e40af; font-size: 0.875rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
    
    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .stat-value { font-size: 2rem; font-weight: 800; color: #1e293b; }
    .stat-label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
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
    
    .internship-detail h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .company {
      color: #64748b;
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }
    
    .dates, .supervisor {
      margin-bottom: 0.75rem;
      color: #475569;
      font-size: 0.9375rem;
      padding: 0.625rem 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.5rem;
    }
    
    .supervisor span { font-weight: 600; color: #6366f1; }
    
    .grade {
      font-weight: 700;
      color: #065f46;
      padding: 0.375rem 0.875rem;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-radius: 9999px;
      font-size: 0.875rem;
    }
    
    .pending {
      color: #92400e;
      font-weight: 600;
      padding: 0.375rem 0.875rem;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 9999px;
      font-size: 0.875rem;
    }
    
    .profile-info .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      transition: all 0.2s ease;
    }
    
    .profile-info .info-row:hover {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      transform: translateX(4px);
    }
    
    .profile-info .info-row:last-child { margin-bottom: 0; }
    .profile-info .label { font-weight: 600; color: #475569; }
    .profile-info .value { color: #1e293b; font-weight: 500; }
    
    .loading { text-align: center; padding: 3rem; color: #64748b; }
    .empty { text-align: center; padding: 2rem; color: #94a3b8; }
    .error { 
      text-align: center; 
      padding: 2rem; 
      color: #dc2626; 
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-radius: 1rem;
      border: 1px solid #fecaca;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
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
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
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
        this.cdr.markForCheck();
        
        // Load student's internships
        this.internshipService.getByStudent(student.id).subscribe({
          next: (internships) => {
            this.myInternships = internships || [];
            this.activeInternship = internships?.find(i => i.status === 'IN_PROGRESS' || i.status === 'APPROVED') || null;
            this.cdr.markForCheck();

            // Load reports for all internships
            this.loadReports();
          },
          error: (error) => {
            console.error('Error loading internships:', error);
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
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
      this.cdr.markForCheck();
    }).catch(error => {
      console.error('Error loading reports:', error);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  downloadReport(report: Report) {
    if (report.filePath) {
      const url = report.filePath.startsWith('http') 
        ? report.filePath 
        : `http://localhost:8080${report.filePath}`;
      window.open(url, '_blank');
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
