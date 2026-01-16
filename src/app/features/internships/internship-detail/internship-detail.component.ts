import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipStatus, Internship } from '../../../core/models';
import { InternshipService } from '../../../core/services/internship.service';

@Component({
  selector: 'app-internship-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Internship Details</h1>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            Back
          </app-button>
          <app-button *ngIf="internship" variant="primary" (click)="edit()">
            Edit
          </app-button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading internship details...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="details-grid" *ngIf="internship && !loading">
        <app-card title="Basic Information">
          <div class="info-row">
            <span class="label">Title:</span>
            <span class="value">{{ internship.title }}</span>
          </div>
          <div class="info-row">
            <span class="label">Company:</span>
            <span class="value">{{ internship.company }}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span [class]="'badge badge-' + internship.status.toLowerCase()">
              {{ internship.status }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">Description:</span>
            <span class="value">{{ internship.description }}</span>
          </div>
        </app-card>

        <app-card title="Duration">
          <div class="info-row">
            <span class="label">Start Date:</span>
            <span class="value">{{ formatDate(internship.startDate) }}</span>
          </div>
          <div class="info-row">
            <span class="label">End Date:</span>
            <span class="value">{{ formatDate(internship.endDate) }}</span>
          </div>
        </app-card>

        <app-card title="Student Information" *ngIf="internship.student">
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ internship.student.user.username || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Level:</span>
            <span class="value">{{ internship.student.level.name || 'N/A' }}</span>
          </div>
        </app-card>

        <app-card title="Supervisor" *ngIf="internship.supervisor">
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ internship.supervisor.user.username || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Sector:</span>
            <span class="value">{{ internship.supervisor.sector.name || 'N/A' }}</span>
          </div>
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
    .loading {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }
    .error {
      padding: 1rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
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
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .badge-approved {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-in_progress {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .badge-completed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-rejected {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `]
})
export class InternshipDetailComponent implements OnInit {
  internship: Internship | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadInternship(id);
    }
  }

  loadInternship(id: number) {
    this.loading = true;
    this.error = '';
    
    this.internshipService.getById(id).subscribe({
      next: (internship) => {
        this.internship = internship;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load internship details. Please try again.';
        this.loading = false;
        console.error('Error loading internship:', err);
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  goBack() {
    this.router.navigate(['/internships']);
  }

  edit() {
    if (this.internship) {
      this.router.navigate(['/internships', this.internship.id, 'edit']);
    }
  }
}
