import { Component, OnInit } from '@angular/core';
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
        <h1>Students</h1>
        <app-button variant="primary" (click)="createStudent()">
          + New Student
        </app-button>
      </div>

      <div *ngIf="loading" class="loading">Loading students...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <app-card *ngIf="!loading && !error">
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
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
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
  `]
})
export class StudentListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'levelName', label: 'Level' }
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
    private authService: AuthService
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
          username: s.user?.username || 'N/A',
          levelName: s.level?.name || 'N/A'
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students. Please try again.';
        this.loading = false;
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
        },
        error: (err) => {
          this.error = 'Failed to delete student.';
          console.error('Error deleting student:', err);
        }
      });
    }
  }
}
