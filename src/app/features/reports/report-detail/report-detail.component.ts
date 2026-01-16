import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Report Details</h1>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            Back
          </app-button>
          <app-button variant="success" (click)="gradeReport()" *ngIf="!report?.grade">
            Grade Report
          </app-button>
        </div>
      </div>

      <div class="details-layout" *ngIf="report">
        <app-card title="Report Information">
          <div class="info-row">
            <span class="label">Title:</span>
            <span class="value">{{ report.title }}</span>
          </div>
          <div class="info-row">
            <span class="label">Submitted At:</span>
            <span class="value">{{ report.submittedAt }}</span>
          </div>
          <div class="info-row">
            <span class="label">Grade:</span>
            <span class="value" [class.pending]="!report.grade">
              {{ report.grade || 'Not graded yet' }}
            </span>
          </div>
        </app-card>

        <app-card title="Internship Details">
          <div class="info-row">
            <span class="label">Title:</span>
            <span class="value">{{ report.internship.title }}</span>
          </div>
          <div class="info-row">
            <span class="label">Company:</span>
            <span class="value">{{ report.internship.company }}</span>
          </div>
          <div class="info-row">
            <span class="label">Student:</span>
            <span class="value">
              {{ report.internship.student.firstName }} {{ report.internship.student.lastName }}
            </span>
          </div>
        </app-card>

        <app-card title="Report Content" [hasFooter]="false">
          <div class="content">
            {{ report.content }}
          </div>
        </app-card>

        <app-card title="Feedback" *ngIf="report.feedback">
          <div class="feedback">
            {{ report.feedback }}
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
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .details-layout {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #374151;
    }
    .value {
      color: #6b7280;
    }
    .value.pending {
      color: #f59e0b;
      font-style: italic;
    }
    .content, .feedback {
      line-height: 1.6;
      color: #374151;
      white-space: pre-wrap;
    }
  `]
})
export class ReportDetailComponent implements OnInit {
  report: any = null;

  mockReports = [
    {
      id: 1,
      title: 'Monthly Progress Report - January',
      content: `During the first month of my internship at Tech Corp, I have been working on various web development projects using Angular and Spring Boot.

Key Achievements:
- Completed onboarding and setup of development environment
- Implemented user authentication module
- Created responsive UI components
- Participated in daily stand-ups and sprint planning

Challenges:
- Learning new technologies and frameworks
- Understanding the existing codebase

Next Steps:
- Continue working on the main application features
- Improve code quality and testing coverage`,
      submittedAt: '2024-01-31',
      grade: 18,
      feedback: 'Excellent progress! Keep up the good work.',
      internship: {
        id: 1,
        title: 'Full Stack Developer',
        company: 'Tech Corp',
        student: { firstName: 'John', lastName: 'Doe' }
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.report = this.mockReports.find(r => r.id === id) || this.mockReports[0];
  }

  goBack() {
    this.router.navigate(['/reports']);
  }

  gradeReport() {
    console.log('Grade report:', this.report.id);
    // Implement grading logic
  }
}
