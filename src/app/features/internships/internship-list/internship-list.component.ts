import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Internship, InternshipStatus, UserRole } from '../../../core/models';
import { InternshipService } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-internship-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Internships</h1>
        <app-button 
          *ngIf="canCreate"
          variant="primary" 
          (click)="createInternship()"
        >
          + New Internship
        </app-button>
      </div>

      <div *ngIf="loading" class="loading">Loading internships...</div>
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
export class InternshipListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'studentName', label: 'Student' },
    { key: 'status', label: 'Status' },
    { key: 'startDate', label: 'Start Date' }
  ];

  actions = [
    { name: 'view', label: 'View', class: 'view' },
    { name: 'edit', label: 'Edit', class: 'edit' },
    { name: 'delete', label: 'Delete', class: 'delete' }
  ];

  internships: Internship[] = [];
  displayData: any[] = [];
  loading = false;
  error = '';
  canCreate = false;

  constructor(
    private router: Router,
    private internshipService: InternshipService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.canCreate = user?.role === UserRole.ADMIN || user?.role === UserRole.STUDENT;
    this.loadInternships();
  }

  loadInternships() {
    this.loading = true;
    this.error = '';
    
    this.internshipService.getAll().subscribe({
      next: (internships) => {
        this.internships = internships;
        this.displayData = internships.map(i => ({
          id: i.id,
          title: i.title,
          company: i.company,
          studentName: i.student?.user?.username || 'N/A',
          status: i.status,
          startDate: new Date(i.startDate).toLocaleDateString()
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load internships. Please try again.';
        this.loading = false;
        console.error('Error loading internships:', err);
      }
    });
  }

  createInternship() {
    this.router.navigate(['/internships/create']);
  }

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    switch (action) {
      case 'view':
        this.router.navigate(['/internships', row.id]);
        break;
      case 'edit':
        this.router.navigate(['/internships', row.id, 'edit']);
        break;
      case 'delete':
        this.deleteInternship(row.id);
        break;
    }
  }

  deleteInternship(id: number) {
    if (confirm('Are you sure you want to delete this internship?')) {
      this.internshipService.delete(id).subscribe({
        next: () => {
          this.loadInternships();
        },
        error: (err) => {
          this.error = 'Failed to delete internship.';
          console.error('Error deleting internship:', err);
        }
      });
    }
  }
}
