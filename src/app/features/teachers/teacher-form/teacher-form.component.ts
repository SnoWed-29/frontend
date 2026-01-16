import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>{{ isEdit ? 'Edit Teacher' : 'Create Teacher' }}</h1>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="teacher-form">
          <div class="form-row">
            <app-input
              id="firstName"
              label="First Name"
              type="text"
              placeholder="Enter first name"
              [(ngModel)]="formData.firstName"
              name="firstName"
              [required]="true"
            ></app-input>

            <app-input
              id="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter last name"
              [(ngModel)]="formData.lastName"
              name="lastName"
              [required]="true"
            ></app-input>
          </div>

          <div class="form-row">
            <app-input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              [(ngModel)]="formData.email"
              name="email"
              [required]="true"
            ></app-input>

            <app-input
              id="phone"
              label="Phone"
              type="text"
              placeholder="Enter phone number"
              [(ngModel)]="formData.phone"
              name="phone"
            ></app-input>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="sector">Sector</label>
              <select id="sector" [(ngModel)]="formData.sector" name="sector" class="form-control">
                <option value="INFORMATIQUE">Informatique</option>
                <option value="MARKETING">Marketing</option>
                <option value="DESIGN">Design</option>
                <option value="BUSINESS">Business</option>
                <option value="COMMUNICATION">Communication</option>
              </select>
            </div>

            <app-input
              id="username"
              label="Username"
              type="text"
              placeholder="Enter username"
              [(ngModel)]="formData.username"
              name="username"
              [required]="true"
            ></app-input>
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
    .teacher-form {
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
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class TeacherFormComponent implements OnInit {
  isEdit = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sector: 'INFORMATIQUE',
    username: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (this.isEdit) {
      this.formData = {
        firstName: 'Dr. Smith',
        lastName: 'Anderson',
        email: 'smith.anderson@example.com',
        phone: '+33 6 11 22 33 44',
        sector: 'INFORMATIQUE',
        username: 'smith.anderson'
      };
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    this.router.navigate(['/teachers']);
  }

  cancel() {
    this.router.navigate(['/teachers']);
  }
}
