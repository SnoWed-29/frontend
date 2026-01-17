import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TeacherService } from '../../../core/services/teacher.service';
import { MetadataService } from '../../../core/services/metadata.service';
import { Sector } from '../../../core/models';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-icon">{{ isEdit ? '✏️' : '➕' }}</div>
        <div class="header-content">
          <h1>{{ isEdit ? 'Edit Teacher' : 'Create Teacher' }}</h1>
          <p class="subtitle">{{ isEdit ? 'Update teacher information' : 'Add a new teacher to the system' }}</p>
        </div>
      </div>

      <app-card [title]="isEdit ? 'Teacher Details' : 'New Teacher'" icon="👨‍🏫">
        <form (ngSubmit)="onSubmit()" class="teacher-form">
          <div class="form-section">
            <div class="section-header">
              <span class="section-icon">👤</span>
              <span>Personal Information</span>
            </div>
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

              <div class="form-group">
                <label for="password">🔐 Password</label>
                <div class="password-row">
                  <input
                    type="text"
                    id="password"
                    [(ngModel)]="formData.password"
                    name="password"
                    class="form-control"
                    placeholder="Enter password"
                    [required]="!isEdit"
                  />
                  <button type="button" class="generate-btn" (click)="generatePassword()">
                    🎲 Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <span class="section-icon">🎯</span>
              <span>Sectors (select multiple)</span>
            </div>
            <div class="sectors-grid">
              <label *ngFor="let sector of sectors" class="checkbox-label">
                <input
                  type="checkbox"
                  [value]="sector.id"
                  [checked]="formData.sectorIds.includes(sector.id)"
                  (change)="onSectorChange($event, sector.id)"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">{{ sector.name }} <span class="level-tag">({{ sector.level?.name }})</span></span>
              </label>
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            <span>⚠️</span> {{ error }}
          </div>
          <div *ngIf="success" class="success-message">
            <span>✅</span> {{ success }}
          </div>

          <div class="form-actions">
            <app-button type="button" variant="secondary" (click)="cancel()">
              ← Cancel
            </app-button>
            <app-button type="submit" variant="primary" [disabled]="isSubmitting">
              {{ isSubmitting ? '⏳ Saving...' : (isEdit ? '💾 Update' : '➕ Create') }}
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
      animation: fadeIn 0.5s ease-out;
    }
    
    .header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 2rem;
      animation: slideInLeft 0.5s ease-out;
    }
    
    .header-icon {
      width: 3.5rem;
      height: 3.5rem;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .header-content h1 {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.25rem 0;
    }
    
    .subtitle { color: #64748b; margin: 0; font-size: 1rem; }
    
    .teacher-form { display: flex; flex-direction: column; gap: 2rem; }
    
    .form-section {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 1rem;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      font-weight: 700;
      color: #475569;
      font-size: 1rem;
    }
    
    .section-icon { font-size: 1.125rem; }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
    }
    
    .form-row:last-child { margin-bottom: 0; }
    
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
    }
    
    .form-group { display: flex; flex-direction: column; }
    
    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
    }
    
    .form-control {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      background: white;
      transition: all 0.2s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .password-row { display: flex; gap: 0.75rem; }
    .password-row input { flex: 1; }
    
    .generate-btn {
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    
    .generate-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    
    .sectors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .checkbox-label:hover {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }
    
    .checkbox-label:has(input:checked) {
      border-color: #10b981;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    }
    
    .checkbox-label input { display: none; }
    
    .checkbox-custom {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #d1d5db;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .checkbox-label:has(input:checked) .checkbox-custom {
      background: #10b981;
      border-color: #10b981;
    }
    
    .checkbox-label:has(input:checked) .checkbox-custom::after {
      content: '✓';
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .checkbox-text { color: #475569; }
    .level-tag { color: #10b981; font-size: 0.8125rem; }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 0.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .error-message {
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #dc2626;
      border-radius: 0.75rem;
      border: 1px solid #fecaca;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    
    .success-message {
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      color: #16a34a;
      border-radius: 0.75rem;
      border: 1px solid #86efac;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  `]
})
export class TeacherFormComponent implements OnInit {
  isEdit = false;
  isSubmitting = false;
  error = '';
  success = '';
  
  sectors: Sector[] = [];
  
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    sectorIds: [] as number[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private metadataService: MetadataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    this.loadSectors();

    if (this.isEdit && id) {
      this.loadTeacher(+id);
    }
  }

  loadSectors() {
    this.metadataService.getSectors().subscribe({
      next: (sectors) => {
        this.sectors = sectors;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading sectors:', err);
        this.cdr.markForCheck();
      }
    });
  }

  loadTeacher(id: number) {
    this.teacherService.getById(id).subscribe({
      next: (teacher) => {
        this.formData = {
          firstName: teacher.user?.firstName || '',
          lastName: teacher.user?.lastName || '',
          email: teacher.user?.email || '',
          password: '',
          sectorIds: teacher.sectors?.map(s => s.id) || []
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading teacher:', err);
        this.error = 'Failed to load teacher data.';
        this.cdr.markForCheck();
      }
    });
  }

  onSectorChange(event: Event, sectorId: number) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.formData.sectorIds.includes(sectorId)) {
        this.formData.sectorIds.push(sectorId);
      }
    } else {
      this.formData.sectorIds = this.formData.sectorIds.filter(id => id !== sectorId);
    }
  }

  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.formData.password = password;
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    this.isSubmitting = true;

    const payload: any = {
      user: {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        email: this.formData.email,
        password: this.formData.password,
        role: 'TEACHER'
      },
      sectors: this.formData.sectorIds.map(id => ({ id }))
    };

    if (this.isEdit) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.teacherService.update(id, payload).subscribe({
        next: () => {
          this.success = 'Teacher updated successfully!';
          this.cdr.markForCheck();
          setTimeout(() => this.router.navigate(['/teachers']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update teacher.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.teacherService.create(payload).subscribe({
        next: () => {
          this.success = 'Teacher created successfully!';
          this.cdr.markForCheck();
          setTimeout(() => this.router.navigate(['/teachers']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create teacher.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/teachers']);
  }
}
