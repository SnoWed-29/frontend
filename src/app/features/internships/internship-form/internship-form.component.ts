import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { InternshipStatus, UserRole, Level, Sector, Student, Teacher } from '../../../core/models';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { MetadataService } from '../../../core/services/metadata.service';

@Component({
  selector: 'app-internship-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-icon">{{ isEdit ? '✏️' : '➕' }}</div>
        <div class="header-content">
          <h1>{{ isEdit ? 'Edit Internship' : 'Create Internship' }}</h1>
          <p class="subtitle">{{ isEdit ? 'Update internship details' : 'Add a new internship record' }}</p>
        </div>
      </div>

      <app-card [title]="isEdit ? 'Internship Details' : 'New Internship'" icon="📋">
        <form (ngSubmit)="onSubmit()" class="internship-form">
          <div class="form-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span>Basic Information</span>
            </div>
            <div class="form-row">
              <app-input
                id="subject"
                label="Subject"
                type="text"
                placeholder="Enter internship subject"
                [(ngModel)]="formData.subject"
                name="subject"
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

            <div class="form-row">
              <app-input
                id="city"
                label="City"
                type="text"
                placeholder="Enter city"
                [(ngModel)]="formData.city"
                name="city"
                [required]="true"
              ></app-input>

              <div class="form-group" *ngIf="isAdmin">
                <label for="teacherId">👨‍🏫 Supervisor (Teacher)</label>
                <select id="teacherId" [(ngModel)]="formData.teacherId" name="teacherId" class="form-control">
                  <option [ngValue]="null">Select a teacher</option>
                  <option *ngFor="let teacher of teachers" [ngValue]="teacher.id">
                    {{ teacher.user?.firstName }} {{ teacher.user?.lastName }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <span class="section-icon">📄</span>
              <span>Description</span>
            </div>
            <div class="form-group">
              <textarea
                id="description"
                [(ngModel)]="formData.description"
                name="description"
                rows="4"
                class="form-control textarea"
                placeholder="Enter a detailed internship description..."
              ></textarea>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <span class="section-icon">📅</span>
              <span>Schedule</span>
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
          </div>

          <!-- Only show status for admins/teachers in edit mode -->
          <div class="form-section" *ngIf="isAdmin && isEdit">
            <div class="section-header">
              <span class="section-icon">📊</span>
              <span>Status</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="status">Current Status</label>
                <select id="status" [(ngModel)]="formData.status" name="status" class="form-control">
                  <option value="DRAFT">📝 Draft</option>
                  <option value="PENDING">⏳ Pending</option>
                  <option value="APPROVED">✅ Approved</option>
                  <option value="IN_PROGRESS">🔄 In Progress</option>
                  <option value="COMPLETED">🎉 Completed</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>
              </div>
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
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
    
    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1rem;
    }
    
    .internship-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
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
    }
    
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
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
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .form-control:hover {
      border-color: #c7d2fe;
    }
    
    textarea.form-control {
      resize: vertical;
      font-family: inherit;
      min-height: 120px;
    }
    
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
export class InternshipFormComponent implements OnInit {
  isEdit = false;
  isSubmitting = false;
  isAdmin = false;
  isStudent = false;
  error = '';
  success = '';
  
  currentStudent: Student | null = null;
  teachers: Teacher[] = [];
  levels: Level[] = [];
  sectors: Sector[] = [];
  
  formData = {
    subject: '',
    company: '',
    city: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    teacherId: null as number | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private metadataService: MetadataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === UserRole.ADMIN;
    this.isStudent = user?.role === UserRole.STUDENT;

    // Load current student profile if student
    if (this.isStudent && user) {
      this.studentService.getByUserId(user.id).subscribe({
        next: (student) => {
          this.currentStudent = student;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading student:', err);
          this.cdr.markForCheck();
        }
      });
    }

    // Load teachers for admin
    if (this.isAdmin) {
      this.teacherService.getAll().subscribe({
        next: (teachers) => {
          this.teachers = teachers;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading teachers:', err);
          this.cdr.markForCheck();
        }
      });
    }

    if (this.isEdit && id) {
      this.loadInternship(+id);
    }
  }

  loadInternship(id: number) {
    this.internshipService.getById(id).subscribe({
      next: (internship) => {
        this.formData = {
          subject: internship.subject || '',
          company: internship.company || '',
          city: internship.city || '',
          description: internship.description || '',
          startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '',
          endDate: internship.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : '',
          status: internship.status || 'DRAFT',
          teacherId: internship.teacherId || internship.teacher?.id || null
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading internship:', err);
        this.error = 'Failed to load internship data.';
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    this.isSubmitting = true;

    // Validate student data before submission
    if (this.isStudent && !this.currentStudent) {
      this.error = 'Student profile not loaded. Please refresh the page.';
      this.isSubmitting = false;
      return;
    }

    if (this.isStudent && !this.currentStudent?.level?.id) {
      this.error = 'Student level not found. Please contact administrator.';
      this.isSubmitting = false;
      return;
    }

    const payload: any = {
      subject: this.formData.subject,
      company: this.formData.company,
      city: this.formData.city,
      description: this.formData.description,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      status: 'DRAFT'
    };

    // For students, auto-assign student and level/sector
    if (this.isStudent && this.currentStudent) {
      payload.student = { id: this.currentStudent.id };
      payload.level = { id: this.currentStudent.level.id };
      if (this.currentStudent.sector?.id) {
        payload.sector = { id: this.currentStudent.sector.id };
      }
    }

    // For admins, allow setting status and teacher
    if (this.isAdmin) {
      if (this.isEdit) {
        payload.status = this.formData.status;
      }
      if (this.formData.teacherId) {
        payload.teacher = { id: this.formData.teacherId };
      }
    }

    console.log('Submitting payload:', payload);

    if (this.isEdit) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.internshipService.update(id, payload).subscribe({
        next: () => {
          this.success = 'Internship updated successfully!';
          this.cdr.markForCheck();
          setTimeout(() => this.router.navigate(['/internships']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update internship.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.internshipService.create(payload).subscribe({
        next: () => {
          this.success = 'Internship created successfully!';
          this.cdr.markForCheck();
          setTimeout(() => this.router.navigate(['/internships']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create internship.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/internships']);
  }
}
