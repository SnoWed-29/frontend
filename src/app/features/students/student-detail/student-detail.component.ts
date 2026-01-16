import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LevelName } from '../../../core/models';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Student Details</h1>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            Back
          </app-button>
          <app-button variant="primary" (click)="edit()">
            Edit
          </app-button>
        </div>
      </div>

      <div class="details-grid" *ngIf="student">
        <app-card title="Personal Information">
          <div class="info-row">
            <span class="label">First Name:</span>
            <span class="value">{{ student.firstName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Last Name:</span>
            <span class="value">{{ student.lastName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ student.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">{{ student.phone }}</span>
          </div>
        </app-card>

        <app-card title="Academic Information">
          <div class="info-row">
            <span class="label">Level:</span>
            <span class="value">{{ student.level.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">Student ID:</span>
            <span class="value">#{{ student.id }}</span>
          </div>
        </app-card>

        <app-card title="Internships">
          <div class="internship-list" *ngIf="student.internships?.length > 0; else noInternships">
            <div class="internship-item" *ngFor="let internship of student.internships">
              <div class="internship-title">{{ internship.title }}</div>
              <div class="internship-company">{{ internship.company }}</div>
            </div>
          </div>
          <ng-template #noInternships>
            <p class="empty">No internships found</p>
          </ng-template>
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
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
    .internship-item {
      padding: 0.75rem;
      background-color: #f9fafb;
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
    }
    .internship-title {
      font-weight: 600;
      color: #111827;
    }
    .internship-company {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .empty {
      color: #6b7280;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class StudentDetailComponent implements OnInit {
  student: any = null;

  mockStudents = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+33 6 12 34 56 78',
      level: { id: 1, name: LevelName.BAC_3 },
      internships: [
        { title: 'Full Stack Developer', company: 'Tech Corp' },
        { title: 'Backend Developer', company: 'StartUp Inc' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.student = this.mockStudents.find(s => s.id === id) || this.mockStudents[0];
  }

  goBack() {
    this.router.navigate(['/students']);
  }

  edit() {
    this.router.navigate(['/students', this.student.id, 'edit']);
  }
}
