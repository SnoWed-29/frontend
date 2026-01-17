import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TeacherService } from '../../../core/services/teacher.service';
import { AuthService } from '../../../core/services/auth.service';
import { Teacher, UserRole } from '../../../core/models';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>👨‍🏫 Teachers</h1>
          <p class="subtitle">Manage teacher profiles and assignments</p>
        </div>
        <app-button *ngIf="isAdmin" variant="primary" (click)="createTeacher()">
          ➕ New Teacher
        </app-button>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading teachers...</p>
      </div>

      <app-card *ngIf="!isLoading" title="Teacher Records" icon="👨‍🏫">
        <app-table
          [columns]="columns"
          [data]="tableData"
          [actions]="actions"
          (actionClick)="onAction($event)"
        ></app-table>
      </app-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1500px;
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
    
    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1rem;
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
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class TeacherListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'sectors', label: 'Sectors' }
  ];

  actions = [
    { name: 'view', label: 'View', class: 'view' },
    { name: 'edit', label: 'Edit', class: 'edit' },
    { name: 'delete', label: 'Delete', class: 'delete' }
  ];

  teachers: Teacher[] = [];
  tableData: any[] = [];
  isLoading = true;
  isAdmin = false;

  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.hasRole(UserRole.ADMIN);
    
    // Only admin can edit/delete
    if (!this.isAdmin) {
      this.actions = [
        { name: 'view', label: 'View', class: 'view' }
      ];
    }

    this.loadTeachers();
  }

  loadTeachers() {
    this.isLoading = true;
    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.tableData = teachers.map(t => ({
          id: t.id,
          firstName: t.user?.firstName || 'N/A',
          lastName: t.user?.lastName || 'N/A',
          email: t.user?.email || 'N/A',
          sectors: t.sectors?.map(s => s.name).join(', ') || 'N/A'
        }));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  createTeacher() {
    this.router.navigate(['/teachers/create']);
  }

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    switch (action) {
      case 'view':
        this.router.navigate(['/teachers', row.id]);
        break;
      case 'edit':
        if (this.isAdmin) {
          this.router.navigate(['/teachers', row.id, 'edit']);
        }
        break;
      case 'delete':
        if (this.isAdmin) {
          this.deleteTeacher(row.id);
        }
        break;
    }
  }

  deleteTeacher(id: number) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.loadTeachers();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error deleting teacher:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }
}
