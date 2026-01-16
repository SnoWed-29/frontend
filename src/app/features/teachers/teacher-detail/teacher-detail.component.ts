import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SectorName } from '../../../core/models';

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Teacher Details</h1>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            Back
          </app-button>
          <app-button variant="primary" (click)="edit()">
            Edit
          </app-button>
        </div>
      </div>

      <div class="details-grid" *ngIf="teacher">
        <app-card title="Personal Information">
          <div class="info-row">
            <span class="label">First Name:</span>
            <span class="value">{{ teacher.firstName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Last Name:</span>
            <span class="value">{{ teacher.lastName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ teacher.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">{{ teacher.phone }}</span>
          </div>
        </app-card>

        <app-card title="Professional Information">
          <div class="info-row">
            <span class="label">Sector:</span>
            <span class="value">{{ teacher.sector.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">Teacher ID:</span>
            <span class="value">#{{ teacher.id }}</span>
          </div>
        </app-card>

        <app-card title="Supervised Internships">
          <div class="internship-list" *ngIf="teacher.supervisions?.length > 0; else noSupervisions">
            <div class="internship-item" *ngFor="let internship of teacher.supervisions">
              <div class="internship-title">{{ internship.title }}</div>
              <div class="internship-company">{{ internship.company }}</div>
              <div class="internship-student">Student: {{ internship.studentName }}</div>
            </div>
          </div>
          <ng-template #noSupervisions>
            <p class="empty">No supervised internships found</p>
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
    .internship-student {
      color: #3b82f6;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .empty {
      color: #6b7280;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class TeacherDetailComponent implements OnInit {
  teacher: any = null;

  mockTeachers = [
    {
      id: 1,
      firstName: 'Dr. Smith',
      lastName: 'Anderson',
      email: 'smith.anderson@example.com',
      phone: '+33 6 11 22 33 44',
      sector: { id: 1, name: SectorName.INFORMATIQUE },
      supervisions: [
        { title: 'Full Stack Developer', company: 'Tech Corp', studentName: 'John Doe' },
        { title: 'Mobile Developer', company: 'App Studio', studentName: 'Jane Smith' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.teacher = this.mockTeachers.find(t => t.id === id) || this.mockTeachers[0];
  }

  goBack() {
    this.router.navigate(['/teachers']);
  }

  edit() {
    this.router.navigate(['/teachers', this.teacher.id, 'edit']);
  }
}
