import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Report, UserRole } from '../../../core/models';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>📝 Report Details</h1>
          <p class="subtitle" *ngIf="report?.internship">{{ report?.internship?.subject }}</p>
        </div>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            ← Back
          </app-button>
          <app-button variant="primary" (click)="downloadReport()" *ngIf="report?.filePath">
            📥 Download Report
          </app-button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading report details...</p>
      </div>
      <div *ngIf="error" class="error">
        <span>⚠️</span> {{ error }}
      </div>

      <div class="details-layout" *ngIf="report && !loading">
        <app-card title="Report Information" icon="📄">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">📎 File</span>
              <span class="info-value file-name">{{ getFileName(report.filePath) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 Uploaded</span>
              <span class="info-value">{{ report.uploadedAt | date }}</span>
            </div>
            <div class="info-item grade-item">
              <span class="info-label">🏆 Grade</span>
              <span [class]="'grade-badge ' + (report.grade ? 'graded' : 'pending')">
                {{ report.grade ? report.grade + '/20' : '⏳ Pending' }}
              </span>
            </div>
          </div>
        </app-card>

        <app-card title="Internship Details" icon="📋" *ngIf="report.internship">
          <div class="internship-header">
            <div class="internship-icon">📋</div>
            <div class="internship-main">
              <div class="internship-title">{{ report.internship.subject }}</div>
              <div class="internship-company">🏢 {{ report.internship.company }}</div>
            </div>
          </div>
          <div class="student-info" *ngIf="report.internship.student">
            <span class="info-label">🎓 Student</span>
            <span class="info-value">{{ report.internship.student.user.firstName }} {{ report.internship.student.user.lastName }}</span>
          </div>
        </app-card>

        <app-card title="Feedback" icon="💬" *ngIf="report.feedback">
          <div class="feedback-content">
            {{ report.feedback }}
          </div>
        </app-card>

        <!-- Grading Section for Teachers -->
        <app-card title="Grade Report" icon="⚡" *ngIf="isTeacher">
          <div class="grading-form">
            <div class="form-row">
              <div class="form-group">
                <label for="grade">🏆 Grade (0-20)</label>
                <input 
                  type="number" 
                  id="grade" 
                  [(ngModel)]="gradeValue" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  class="grade-input"
                  placeholder="0"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="feedback">💬 Feedback</label>
              <textarea 
                id="feedback" 
                [(ngModel)]="feedbackValue" 
                rows="4"
                class="feedback-input"
                placeholder="Enter your feedback for the student..."
              ></textarea>
            </div>
            <app-button variant="primary" (click)="submitGrade()">
              💾 Submit Grade
            </app-button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
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
    .actions { display: flex; gap: 0.75rem; }
    
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
    
    .details-layout {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .info-item {
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      transition: all 0.2s ease;
    }
    
    .info-item:hover {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      transform: translateY(-2px);
    }
    
    .info-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 0.375rem;
    }
    
    .info-value {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .file-name {
      word-break: break-all;
      color: #6366f1;
    }
    
    .grade-item { text-align: center; }
    
    .grade-badge {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: 700;
    }
    
    .grade-badge.graded {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
    }
    
    .grade-badge.pending {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
    }
    
    .internship-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .internship-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .internship-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    
    .internship-company {
      color: #64748b;
      font-size: 0.9375rem;
    }
    
    .student-info {
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
    }
    
    .feedback-content {
      line-height: 1.75;
      color: #475569;
      white-space: pre-wrap;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      border-left: 4px solid #8b5cf6;
    }
    
    .grading-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      font-weight: 600;
      color: #475569;
    }
    
    .grade-input {
      width: 120px;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      text-align: center;
      background: white;
      transition: all 0.2s ease;
    }
    
    .grade-input:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }
    
    .feedback-input {
      padding: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 1rem;
      resize: vertical;
      min-height: 120px;
      background: white;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    
    .feedback-input:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ReportDetailComponent implements OnInit {
  report: Report | null = null;
  loading = false;
  error = '';
  
  isTeacher = false;
  gradeValue: number | null = null;
  feedbackValue = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isTeacher = this.authService.hasRole(UserRole.TEACHER);
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadReport(id);
    }
  }

  loadReport(id: number) {
    this.loading = true;
    this.error = '';
    
    this.reportService.getById(id).subscribe({
      next: (report) => {
        this.report = report;
        this.gradeValue = report.grade || null;
        this.feedbackValue = report.feedback || '';
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load report details.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading report:', err);
      }
    });
  }

  getFileName(filePath: string): string {
    if (!filePath) return 'No file';
    return filePath.split('/').pop() || filePath;
  }

  downloadReport() {
    if (!this.report?.id) return;
    
    this.reportService.downloadReport(this.report.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.getFileName(this.report!.filePath);
        link.click();
        window.URL.revokeObjectURL(url);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error downloading report:', err);
        alert('Failed to download report.');
        this.cdr.markForCheck();
      }
    });
  }

  submitGrade() {
    if (!this.report || !this.isTeacher) return;
    
    if (this.gradeValue === null || this.gradeValue < 0 || this.gradeValue > 20) {
      alert('Please enter a valid grade between 0 and 20.');
      return;
    }

    this.reportService.gradeReport(this.report.id, this.gradeValue, this.feedbackValue).subscribe({
      next: (updated) => {
        this.report = updated;
        alert('Grade submitted successfully!');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error grading report:', err);
        alert('Failed to submit grade.');
        this.cdr.markForCheck();
      }
    });
  }

  goBack() {
    this.router.navigate(['/reports']);
  }
}
