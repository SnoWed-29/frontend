import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Report, UserRole, Student, Teacher } from '../../../core/models';
import { ReportService } from '../../../core/services/report.service';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>📝 Reports</h1>
          <p class="subtitle">View and manage internship reports</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
      <div *ngIf="error" class="error">
        <span>⚠️</span> {{ error }}
      </div>

      <app-card *ngIf="!loading && !error" title="Report Records" icon="📝">
        <div class="info-message" *ngIf="reports.length === 0">
          <span class="empty-icon">📭</span>
          <p>No reports found</p>
        </div>
        <app-table
          *ngIf="reports.length > 0"
          [columns]="columns"
          [data]="displayData"
          [actions]="getActionsForRole()"
          (actionClick)="onAction($event)"
          (rowClick)="onRowClick($event)"
        ></app-table>
      </app-card>
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
      font-size: 1rem;
    }
    
    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }
    
    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid #e2e8f0;
      border-top-color: #8b5cf6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    .error {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #dc2626;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
      border: 1px solid #fecaca;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    
    .info-message {
      text-align: center;
      padding: 3rem 2rem;
    }
    
    .empty-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }
    
    .info-message p {
      color: #94a3b8;
      margin: 0;
      font-size: 1.125rem;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ReportListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'internshipSubject', label: 'Internship' },
    { key: 'studentName', label: 'Student' },
    { key: 'company', label: 'Company' },
    { key: 'uploadedAt', label: 'Uploaded' },
    { key: 'grade', label: 'Grade' },
    { key: 'feedback', label: 'Feedback' }
  ];

  reports: Report[] = [];
  displayData: any[] = [];
  loading = false;
  error = '';
  
  isAdmin = false;
  isStudent = false;
  isTeacher = false;
  
  currentStudent: Student | null = null;
  currentTeacher: Teacher | null = null;

  constructor(
    private router: Router,
    private reportService: ReportService,
    private internshipService: InternshipService,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === UserRole.ADMIN;
    this.isStudent = user?.role === UserRole.STUDENT;
    this.isTeacher = user?.role === UserRole.TEACHER;

    // Load current user profile
    if (this.isStudent && user) {
      this.studentService.getByUserId(user.id).subscribe({
        next: (student) => {
          this.currentStudent = student;
          this.cdr.markForCheck();
          this.loadReportsForStudent();
        },
        error: (err) => {
          console.error('Error loading student:', err);
          this.cdr.markForCheck();
          this.loadAllReports();
        }
      });
    } else if (this.isTeacher && user) {
      this.teacherService.getByUserId(user.id).subscribe({
        next: (teacher) => {
          this.currentTeacher = teacher;
          this.cdr.markForCheck();
          this.loadReportsForTeacher();
        },
        error: (err) => {
          console.error('Error loading teacher:', err);
          this.cdr.markForCheck();
          this.loadAllReports();
        }
      });
    } else {
      this.loadAllReports();
    }
  }

  loadAllReports() {
    this.loading = true;
    this.error = '';

    this.reportService.getAll().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.updateDisplayData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load reports. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading reports:', err);
      }
    });
  }

  loadReportsForStudent() {
    if (!this.currentStudent) return;

    this.loading = true;
    this.error = '';

    // Get internships for this student, then get reports for those internships
    this.internshipService.getByStudent(this.currentStudent.id).subscribe({
      next: (internships) => {
        if (internships.length === 0) {
          this.reports = [];
          this.displayData = [];
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        // Load reports for each internship
        const reportPromises = internships.map(i => 
          this.reportService.getByInternship(i.id).toPromise()
        );

        Promise.all(reportPromises).then(reportsArrays => {
          this.reports = reportsArrays.flat().filter(r => r != null) as Report[];
          this.updateDisplayData();
          this.loading = false;
          this.cdr.markForCheck();
        }).catch(err => {
          this.error = 'Failed to load reports.';
          this.loading = false;
          this.cdr.markForCheck();
          console.error('Error loading reports:', err);
        });
      },
      error: (err) => {
        this.error = 'Failed to load internships.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading internships:', err);
      }
    });
  }

  loadReportsForTeacher() {
    if (!this.currentTeacher) return;

    this.loading = true;
    this.error = '';

    // Get all reports, then filter by teacher's sectors
    this.reportService.getAll().subscribe({
      next: (reports) => {
        const sectorIds = this.currentTeacher?.sectors?.map(s => s.id) || [];
        
        // Filter reports where the internship's sector matches teacher's sectors
        this.reports = reports.filter(r => {
          const internshipSectorId = r.internship?.sectorId || r.internship?.sector?.id;
          return internshipSectorId && sectorIds.includes(internshipSectorId);
        });
        
        this.updateDisplayData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load reports.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading reports:', err);
      }
    });
  }

  updateDisplayData() {
    this.displayData = this.reports.map(r => ({
      id: r.id,
      internshipSubject: r.internship?.subject || 'N/A',
      studentName: r.internship?.student?.user 
        ? `${r.internship.student.user.firstName} ${r.internship.student.user.lastName}`
        : 'N/A',
      company: r.internship?.company || 'N/A',
      uploadedAt: r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : 'N/A',
      grade: r.grade != null ? `${r.grade}/20` : 'Not graded',
      feedback: r.feedback || '-',
      filePath: r.filePath
    }));
  }

  getActionsForRole() {
    if (this.isTeacher) {
      return [
        { name: 'download', label: 'Download', class: 'view' },
        { name: 'grade', label: 'Grade', class: 'edit' }
      ];
    }
    return [
      { name: 'download', label: 'Download', class: 'view' }
    ];
  }

  onRowClick(row: any) {
    this.downloadReport(row.filePath);
  }

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    switch (action) {
      case 'download':
        this.downloadReport(row.filePath);
        break;
      case 'grade':
        this.router.navigate(['/reports', row.id]);
        break;
    }
  }

  downloadReport(filePath: string) {
    if (filePath) {
      // Construct the full URL if it's a relative path
      const url = filePath.startsWith('http') 
        ? filePath 
        : `http://localhost:8080${filePath}`;
      window.open(url, '_blank');
    } else {
      alert('Report file not available.');
    }
  }
}
