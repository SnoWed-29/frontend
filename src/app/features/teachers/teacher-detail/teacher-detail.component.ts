import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        <div class="header-content">
          <h1>👨‍🏫 Teacher Details</h1>
          <p class="subtitle" *ngIf="teacher">{{ teacher.firstName }} {{ teacher.lastName }}</p>
        </div>
        <div class="actions">
          <app-button variant="secondary" (click)="goBack()">
            ← Back
          </app-button>
          <app-button variant="primary" (click)="edit()">
            ✏️ Edit
          </app-button>
        </div>
      </div>

      <div class="details-grid" *ngIf="teacher">
        <app-card title="Personal Information" icon="👤">
          <div class="person-header">
            <div class="person-avatar">
              {{ teacher.firstName?.charAt(0) }}{{ teacher.lastName?.charAt(0) }}
            </div>
            <div class="person-main">
              <div class="person-name">{{ teacher.firstName }} {{ teacher.lastName }}</div>
              <div class="person-id">Teacher ID: #{{ teacher.id }}</div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">📧 Email</span>
              <span class="info-value">{{ teacher.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📱 Phone</span>
              <span class="info-value">{{ teacher.phone || 'Not provided' }}</span>
            </div>
          </div>
        </app-card>

        <app-card title="Professional Information" icon="🎯">
          <div class="info-grid">
            <div class="info-item highlight">
              <span class="info-label">📚 Sector</span>
              <span class="info-value sector-badge">{{ teacher.sector?.name }}</span>
            </div>
          </div>
        </app-card>

        <app-card title="Supervised Internships" icon="📋">
          <div class="internship-list" *ngIf="teacher.supervisions?.length > 0; else noSupervisions">
            <div class="internship-item" *ngFor="let internship of teacher.supervisions">
              <div class="internship-icon">📋</div>
              <div class="internship-info">
                <div class="internship-title">{{ internship.title }}</div>
                <div class="internship-company">🏢 {{ internship.company }}</div>
                <div class="internship-student">🎓 {{ internship.studentName }}</div>
              </div>
            </div>
          </div>
          <ng-template #noSupervisions>
            <div class="empty">
              <span class="empty-icon">📭</span>
              <p>No supervised internships found</p>
            </div>
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
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    
    .person-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      margin-bottom: 1.25rem;
    }
    
    .person-avatar {
      width: 4.5rem;
      height: 4.5rem;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .person-name {
      font-size: 1.375rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    
    .person-id {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
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
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      transform: translateY(-2px);
    }
    
    .info-item.highlight {
      grid-column: span 2;
      text-align: center;
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
    
    .sector-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: white !important;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: 700;
    }
    
    .internship-list { display: flex; flex-direction: column; gap: 0.75rem; }
    
    .internship-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .internship-item:hover {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      transform: translateX(4px);
    }
    
    .internship-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      flex-shrink: 0;
    }
    
    .internship-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    
    .internship-company {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 0.125rem;
    }
    
    .internship-student {
      color: #10b981;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .empty {
      text-align: center;
      padding: 2.5rem 1rem;
    }
    
    .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .empty p { color: #94a3b8; margin: 0; font-size: 1rem; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
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
      sector: { id: 1, name: SectorName.DEV },
      supervisions: [
        { title: 'Full Stack Developer', company: 'Tech Corp', studentName: 'John Doe' },
        { title: 'Mobile Developer', company: 'App Studio', studentName: 'Jane Smith' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
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
