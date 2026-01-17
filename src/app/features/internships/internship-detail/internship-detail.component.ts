import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InternshipStatus, Internship, UserRole } from '../../../core/models';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-internship-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>📋 Internship Details</h1>
          <p class="subtitle" *ngIf="internship">{{ internship.subject }}</p>
        </div>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            ← Back
          </app-button>
          <app-button *ngIf="internship && canEdit" variant="primary" (click)="edit()">
            ✏️ Edit
          </app-button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading internship details...</p>
      </div>
      <div *ngIf="error" class="error">
        <span>⚠️</span> {{ error }}
      </div>

      <div class="details-grid" *ngIf="internship && !loading">
        <app-card title="Basic Information" icon="📝">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">📌 Subject</span>
              <span class="info-value">{{ internship.subject }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🏢 Company</span>
              <span class="info-value">{{ internship.company }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📍 City</span>
              <span class="info-value">{{ internship.city || 'Not specified' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📊 Status</span>
              <span [class]="'status-badge status-' + internship.status.toLowerCase()">
                {{ internship.status }}
              </span>
            </div>
          </div>
          <div class="description-section" *ngIf="internship.description">
            <span class="info-label">📄 Description</span>
            <p class="description-text">{{ internship.description }}</p>
          </div>
        </app-card>

        <app-card title="Duration" icon="📅">
          <div class="duration-display">
            <div class="date-card">
              <span class="date-label">Start Date</span>
              <span class="date-value">{{ formatDate(internship.startDate) }}</span>
            </div>
            <div class="date-arrow">→</div>
            <div class="date-card">
              <span class="date-label">End Date</span>
              <span class="date-value">{{ formatDate(internship.endDate) }}</span>
            </div>
          </div>
        </app-card>

        <app-card title="Student Information" icon="🎓" *ngIf="internship.student">
          <div class="person-card">
            <div class="person-avatar">
              {{ internship.student.user?.firstName?.charAt(0) }}{{ internship.student.user?.lastName?.charAt(0) }}
            </div>
            <div class="person-info">
              <div class="person-name">{{ internship.student.user?.firstName }} {{ internship.student.user?.lastName }}</div>
              <div class="person-detail">📧 {{ internship.student.user?.email || 'No email' }}</div>
              <div class="person-detail">📚 {{ internship.student.level?.name || internship.level?.name || 'N/A' }}</div>
              <div class="person-detail">🎯 {{ internship.student.sector?.name || internship.sector?.name || 'N/A' }}</div>
            </div>
          </div>
        </app-card>

        <app-card title="Supervisor" icon="👨‍🏫" *ngIf="internship.teacher">
          <div class="person-card">
            <div class="person-avatar teacher">
              {{ internship.teacher.user?.firstName?.charAt(0) }}{{ internship.teacher.user?.lastName?.charAt(0) }}
            </div>
            <div class="person-info">
              <div class="person-name">{{ internship.teacher.user?.firstName }} {{ internship.teacher.user?.lastName }}</div>
              <div class="person-detail">📧 {{ internship.teacher.user?.email || 'No email' }}</div>
            </div>
          </div>
        </app-card>

        <!-- Status Update Section for Teachers -->
        <app-card title="Update Status" icon="⚡" *ngIf="isTeacher">
          <div class="status-form">
            <label>Change Status</label>
            <select [(ngModel)]="newStatus" class="status-select">
              <option value="DRAFT">📝 Draft</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="APPROVED">✅ Approved</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="COMPLETED">🎉 Completed</option>
              <option value="REJECTED">❌ Rejected</option>
            </select>
            <app-button variant="primary" (click)="updateStatus()">
              💾 Update Status
            </app-button>
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
    
    .actions {
      display: flex;
      gap: 0.75rem;
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
      border-top-color: #6366f1;
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
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
    
    .description-section {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .description-text {
      margin: 0.5rem 0 0 0;
      color: #475569;
      line-height: 1.6;
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .status-draft { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #64748b; }
    .status-pending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
    .status-approved { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
    .status-in_progress { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; }
    .status-completed { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
    .status-rejected { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); color: #dc2626; }
    
    .duration-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
    }
    
    .date-card {
      flex: 1;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      text-align: center;
    }
    
    .date-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 0.5rem;
    }
    
    .date-value {
      display: block;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .date-arrow {
      font-size: 1.5rem;
      color: #6366f1;
      font-weight: 700;
    }
    
    .person-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
    }
    
    .person-avatar {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.25rem;
    }
    
    .person-avatar.teacher {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    }
    
    .person-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .person-detail {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    
    .status-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .status-form label {
      font-weight: 600;
      color: #475569;
    }
    
    .status-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 1rem;
      background: white;
      transition: all 0.2s ease;
    }
    
    .status-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class InternshipDetailComponent implements OnInit {
  internship: Internship | null = null;
  loading = false;
  error = '';
  newStatus: InternshipStatus = InternshipStatus.PENDING;
  
  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.hasRole(UserRole.ADMIN);
    this.isTeacher = this.authService.hasRole(UserRole.TEACHER);
    this.isStudent = this.authService.hasRole(UserRole.STUDENT);
    
    // Students can edit their own internships, admin can edit all
    // Teachers can only update status (not full edit)
    this.canEdit = this.isAdmin || this.isStudent;

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
        this.newStatus = internship.status;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load internship details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading internship:', err);
      }
    });
  }

  updateStatus() {
    if (!this.internship || !this.isTeacher) return;
    
    this.internshipService.updateStatus(this.internship.id, this.newStatus).subscribe({
      next: (updated) => {
        this.internship = updated;
        alert('Status updated successfully!');
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
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
    if (this.internship && this.canEdit) {
      this.router.navigate(['/internships', this.internship.id, 'edit']);
    }
  }
}
