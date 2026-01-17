import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipService } from '../../../core/services/internship.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { StudentService } from '../../../core/services/student.service';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';
import { Internship, Report, Teacher, Student } from '../../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>Teacher Dashboard</h1>
          <p class="subtitle">Manage your supervised internships and student reports</p>
        </div>
        <div class="header-badge">
          <span class="badge-icon">👨‍🏫</span>
          <span class="badge-text">Teacher</span>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!isLoading && teacherProfile">
        <div class="stat-card" (click)="navigate('/students')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);">
            <span style="color: #065f46;">👨‍🎓</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ myStudents.length }}</div>
            <div class="stat-label">My Students</div>
          </div>
        </div>

        <div class="stat-card" (click)="navigate('/internships')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
            <span style="color: #1e40af;">📋</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ classInternships.length }}</div>
            <div class="stat-label">Class Internships</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
            <span style="color: #92400e;">⏳</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingReviews }}</div>
            <div class="stat-label">Pending Reviews</div>
          </div>
        </div>

        <div class="stat-card" (click)="navigate('/reports')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);">
            <span style="color: #6b21a8;">📝</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ ungradedReports.length }}</div>
            <div class="stat-label">Ungraded Reports</div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading dashboard data</p>
      </div>

      <div class="content-grid" *ngIf="!isLoading && teacherProfile">
        <app-card title="My Sectors" icon="🎯">
          <div class="sectors-list">
            <div class="sector-badge" *ngFor="let sector of teacherProfile.sectors">
              <span class="sector-icon">📚</span>
              {{ sector.name }} <span class="level-tag">({{ sector.level?.name }})</span>
            </div>
            <div class="empty" *ngIf="!teacherProfile.sectors?.length">
              <span>📭</span> No sectors assigned
            </div>
          </div>
        </app-card>

        <app-card title="Class Internships" icon="📋">
          <div class="list">
            <div class="list-item" *ngFor="let internship of classInternships.slice(0, 5)" (click)="navigate('/internships/' + internship.id)">
              <div class="item-main">
                <div class="item-title">{{ internship.subject }}</div>
                <div class="item-subtitle">👤 {{ getStudentName(internship) }} • 🏢 {{ internship.company }}</div>
              </div>
              <div [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </div>
            </div>
            <div class="empty" *ngIf="classInternships.length === 0">
              <span>📭</span> No internships in your class
            </div>
          </div>
        </app-card>

        <app-card title="Reports to Grade" icon="📝">
          <div class="list">
            <div class="list-item" *ngFor="let report of ungradedReports.slice(0, 5)" (click)="navigate('/reports/' + report.id)">
              <div class="item-main">
                <div class="item-title">{{ report.internship?.subject }}</div>
                <div class="item-subtitle">📅 {{ report.uploadedAt | date }}</div>
              </div>
              <app-button size="sm" variant="primary">Grade →</app-button>
            </div>
            <div class="empty" *ngIf="ungradedReports.length === 0">
              <span>✅</span> No reports to grade
            </div>
          </div>
        </app-card>
      </div>

      <div class="error" *ngIf="!isLoading && !teacherProfile">
        <p>⚠️ Unable to load teacher profile. Please contact administrator.</p>
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
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-radius: 9999px;
      border: 2px solid #34d399;
    }
    
    .badge-icon { font-size: 1.25rem; }
    .badge-text { font-weight: 700; color: #065f46; font-size: 0.875rem; }
    
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
    
    .stat-value { font-size: 2rem; font-weight: 800; color: #1e293b; }
    .stat-label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 1.5rem;
    }
    
    .sectors-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .sector-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0369a1;
      border-radius: 9999px;
      font-size: 0.9375rem;
      font-weight: 600;
      border: 1px solid #7dd3fc;
      transition: all 0.2s ease;
    }
    
    .sector-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(14 165 233 / 0.2);
    }
    
    .sector-icon { font-size: 1rem; }
    .level-tag { color: #0c4a6e; font-weight: 500; font-size: 0.8125rem; }
    
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
export class TeacherDashboardComponent implements OnInit {
  teacherProfile: Teacher | null = null;
  myStudents: Student[] = [];
  classInternships: Internship[] = [];
  ungradedReports: Report[] = [];
  pendingReviews = 0;
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private teacherService: TeacherService,
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

    // Get teacher profile by user ID
    this.teacherService.getByUserId(currentUser.id).subscribe({
      next: (teacher) => {
        this.teacherProfile = teacher;
        const sectorIds = teacher.sectors?.map(s => s.id) || [];
        this.cdr.markForCheck();
        
        // Load students in teacher's sectors
        this.studentService.getAll().subscribe({
          next: (students) => {
            // Filter students by teacher's sectors
            this.myStudents = students.filter(s => 
              s.sector && sectorIds.includes(s.sector.id)
            );
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error loading students:', error);
            this.cdr.markForCheck();
          }
        });

        // Load internships for teacher's sectors
        this.internshipService.getAll().subscribe({
          next: (internships) => {
            this.classInternships = internships.filter(i => {
              const internshipSectorId = i.sectorId || i.sector?.id;
              return internshipSectorId && sectorIds.includes(internshipSectorId);
            });
            this.pendingReviews = this.classInternships.filter(i => 
              i.status === 'PENDING' || i.status === 'DRAFT'
            ).length;
            this.cdr.markForCheck();

            // Load reports for these internships
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
        console.error('Error loading teacher profile:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadReports() {
    this.reportService.getAll().subscribe({
      next: (reports) => {
        const sectorIds = this.teacherProfile?.sectors?.map(s => s.id) || [];
        
        // Filter reports by teacher's sectors
        const classReports = reports.filter(r => {
          const internshipSectorId = r.internship?.sectorId || r.internship?.sector?.id;
          return internshipSectorId && sectorIds.includes(internshipSectorId);
        });

        this.ungradedReports = classReports.filter(r => r.grade == null);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getStudentName(internship: Internship): string {
    if (internship.student?.user) {
      return `${internship.student.user.firstName} ${internship.student.user.lastName}`;
    }
    return 'Unknown Student';
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
