import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { InternshipStatus } from '../../../core/models';

@Component({
  selector: 'app-internship-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>{{ isEdit ? 'Edit Internship' : 'Create Internship' }}</h1>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="internship-form">
          <div class="form-row">
            <app-input
              id="title"
              label="Title"
              type="text"
              placeholder="Enter internship title"
              [(ngModel)]="formData.title"
              name="title"
              [required]="true"
            ></app-input>

            <app-input
              id="company"
              label="Company"
              type="text"
              placeholder="Enter company name"
              [(ngModel)]="formData.company"
              name="company"
              [required]="true"
            ></app-input>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              [(ngModel)]="formData.description"
              name="description"
              rows="4"
              class="form-control"
              placeholder="Enter internship description"
            ></textarea>
          </div>

          <div class="form-row">
            <app-input
              id="startDate"
              label="Start Date"
              type="date"
              [(ngModel)]="formData.startDate"
              name="startDate"
              [required]="true"
            ></app-input>

            <app-input
              id="endDate"
              label="End Date"
              type="date"
              [(ngModel)]="formData.endDate"
              name="endDate"
              [required]="true"
            ></app-input>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" [(ngModel)]="formData.status" name="status" class="form-control">
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div class="form-group">
              <label for="studentId">Student</label>
              <select id="studentId" [(ngModel)]="formData.studentId" name="studentId" class="form-control">
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Bob Johnson</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <app-button type="button" variant="secondary" (click)="cancel()">
              Cancel
            </app-button>
            <app-button type="submit" variant="primary">
              {{ isEdit ? 'Update' : 'Create' }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .internship-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    .form-control {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }
    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class InternshipFormComponent implements OnInit {
  isEdit = false;
  formData = {
    title: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PENDING',
    studentId: '1'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (this.isEdit) {
      // Load mock data for edit
      this.formData = {
        title: 'Full Stack Developer',
        company: 'Tech Corp',
        description: 'Work on web applications',
        startDate: '2024-01-15',
        endDate: '2024-06-15',
        status: 'IN_PROGRESS',
        studentId: '1'
      };
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    this.router.navigate(['/internships']);
  }

  cancel() {
    this.router.navigate(['/internships']);
  }
}
