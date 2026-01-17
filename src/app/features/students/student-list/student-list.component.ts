import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Student, UserRole } from '../../../core/models';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>🎓 Students</h1>
          <p class="subtitle">Manage student records and profiles</p>
        </div>
        <app-button *ngIf="canCreate" variant="primary" (click)="createStudent()">
          ➕ New Student
        </app-button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
      <div *ngIf="error" class="error">
        <span>⚠️</span> {{ error }}
      </div>

      <app-card *ngIf="!loading && !error" title="Student Records" icon="🎓">
        <app-table
          [columns]="columns"
          [data]="displayData"
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
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class StudentListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'levelName', label: 'Level' },
    { key: 'sectorName', label: 'Sector' },
    { key: 'academicYear', label: 'Academic Year' }
  ];

  actions = [
    { name: 'view', label: 'View', class: 'view' },
    { name: 'edit', label: 'Edit', class: 'edit' },
    { name: 'delete', label: 'Delete', class: 'delete' }
  ];

  students: Student[] = [];
  displayData: any[] = [];
  loading = false;
  error = '';
  canCreate = false;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.canCreate = user?.role === UserRole.ADMIN;
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.error = '';
    
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
        this.displayData = students.map(s => ({
          id: s.id,
          firstName: s.user?.firstName || 'N/A',
          lastName: s.user?.lastName || 'N/A',
          email: s.user?.email || 'N/A',
          levelName: s.level?.name || 'N/A',
          sectorName: s.sector?.name || 'N/A',
          academicYear: s.academicYear || 'N/A'
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load students. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading students:', err);
      }
    });
  }

  createStudent() {
    this.router.navigate(['/students/create']);
  }

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    switch (action) {
      case 'view':
        this.router.navigate(['/students', row.id]);
        break;
      case 'edit':
        this.router.navigate(['/students', row.id, 'edit']);
        break;
      case 'delete':
        this.deleteStudent(row.id);
        break;
    }
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe({
        next: () => {
          this.loadStudents();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Failed to delete student.';
          this.cdr.markForCheck();
          console.error('Error deleting student:', err);
        }
      });
    }
  }
}
