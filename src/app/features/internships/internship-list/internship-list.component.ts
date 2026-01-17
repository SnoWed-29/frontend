import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Internship, InternshipStatus, UserRole, Level, Sector, Student, Teacher } from '../../../core/models';
import { InternshipService, InternshipSearchCriteria } from '../../../core/services/internship.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { MetadataService } from '../../../core/services/metadata.service';

@Component({
  selector: 'app-internship-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <h1>📋 Internships</h1>
          <p class="subtitle">Manage and track all internship records</p>
        </div>
        <app-button 
          *ngIf="canCreate"
          variant="primary" 
          (click)="createInternship()"
        >
          ➕ New Internship
        </app-button>
      </div>

      <!-- Filters -->
      <div class="filters" *ngIf="!isAdmin">
        <div class="filter-header">
          <span class="filter-icon">🔍</span>
          <span>Filter Internships</span>
        </div>
        <div class="filter-row">
          <div class="filter-group">
            <label>📚 Level</label>
            <select [(ngModel)]="filters.levelId" (change)="onFilterChange()" class="filter-control">
              <option [ngValue]="null">All Levels</option>
              <option *ngFor="let level of levels" [ngValue]="level.id">{{ level.name }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>🎯 Sector</label>
            <select [(ngModel)]="filters.sectorId" (change)="onFilterChange()" class="filter-control">
              <option [ngValue]="null">All Sectors</option>
              <option *ngFor="let sector of sectors" [ngValue]="sector.id">{{ sector.name }}</option>
            </select>
          </div>
          
          <div class="filter-group" *ngIf="isStudent">
            <app-button 
              [variant]="showOnlyMine ? 'primary' : 'secondary'" 
              size="sm"
              (click)="toggleMyInternships()"
            >
              {{ showOnlyMine ? '📋 Show All' : '👤 My Internships Only' }}
            </app-button>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading internships...</p>
      </div>
      <div *ngIf="error" class="error">
        <span>⚠️</span> {{ error }}
      </div>

      <app-card *ngIf="!loading && !error" title="Internship Records" icon="📋">
        <app-table
          [columns]="columns"
          [data]="displayData"
          [actions]="getActionsForRole()"
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
    
    .filters {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(226, 232, 240, 0.8);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
      animation: fadeInUp 0.5s ease-out 0.1s backwards;
    }
    
    .filter-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      color: #475569;
    }
    
    .filter-icon { font-size: 1.25rem; }
    
    .filter-row {
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #475569;
    }
    
    .filter-control {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      min-width: 180px;
      background: white;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .filter-control:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .filter-control:hover {
      border-color: #c7d2fe;
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
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class InternshipListComponent implements OnInit {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'company', label: 'Company' },
    { key: 'city', label: 'City' },
    { key: 'studentName', label: 'Student' },
    { key: 'levelName', label: 'Level' },
    { key: 'status', label: 'Status' },
    { key: 'startDate', label: 'Start Date' }
  ];

  internships: Internship[] = [];
  displayData: any[] = [];
  loading = false;
  error = '';
  canCreate = false;
  isAdmin = false;
  isStudent = false;
  isTeacher = false;
  showOnlyMine = false;
  
  currentStudent: Student | null = null;
  currentTeacher: Teacher | null = null;
  levels: Level[] = [];
  sectors: Sector[] = [];
  
  filters: InternshipSearchCriteria = {
    levelId: undefined,
    sectorId: undefined,
    studentId: undefined
  };

  constructor(
    private router: Router,
    private internshipService: InternshipService,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private metadataService: MetadataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === UserRole.ADMIN;
    this.isStudent = user?.role === UserRole.STUDENT;
    this.isTeacher = user?.role === UserRole.TEACHER;
    this.canCreate = this.isStudent; // Only students can create internships

    // Load metadata for filters
    this.metadataService.getLevels().subscribe({
      next: (levels) => this.levels = levels,
      error: (err) => console.error('Error loading levels:', err)
    });

    this.metadataService.getSectors().subscribe({
      next: (sectors) => this.sectors = sectors,
      error: (err) => console.error('Error loading sectors:', err)
    });

    // Load current user profile if student or teacher
    if (this.isStudent && user) {
      this.studentService.getByUserId(user.id).subscribe({
        next: (student) => {
          this.currentStudent = student;
          this.loadInternships();
        },
        error: (err) => {
          console.error('Error loading student:', err);
          this.loadInternships();
        }
      });
    } else if (this.isTeacher && user) {
      this.teacherService.getByUserId(user.id).subscribe({
        next: (teacher) => {
          this.currentTeacher = teacher;
          this.loadInternshipsForTeacher();
        },
        error: (err) => {
          console.error('Error loading teacher:', err);
          this.loadInternships();
        }
      });
    } else {
      this.loadInternships();
    }
  }

  loadInternships() {
    this.loading = true;
    this.error = '';
    
    const criteria: InternshipSearchCriteria = {};
    
    if (this.showOnlyMine && this.currentStudent) {
      criteria.studentId = this.currentStudent.id;
    }
    if (this.filters.levelId) {
      criteria.levelId = this.filters.levelId;
    }
    if (this.filters.sectorId) {
      criteria.sectorId = this.filters.sectorId;
    }

    const hasFilters = Object.keys(criteria).some(k => (criteria as any)[k] != null);
    
    const request$ = hasFilters 
      ? this.internshipService.search(criteria)
      : this.internshipService.getAll();

    request$.subscribe({
      next: (internships) => {
        this.internships = internships;
        this.updateDisplayData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load internships. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading internships:', err);
      }
    });
  }

  loadInternshipsForTeacher() {
    if (!this.currentTeacher) return;

    this.loading = true;
    this.error = '';

    // For teachers, filter by their sectors
    const sectorIds = this.currentTeacher.sectors?.map(s => s.id) || [];
    
    this.internshipService.getAll().subscribe({
      next: (internships) => {
        // Filter internships by teacher's sectors
        this.internships = internships.filter(i => 
          sectorIds.includes(i.sectorId || i.sector?.id || 0)
        );
        this.updateDisplayData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load internships. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading internships:', err);
      }
    });
  }

  updateDisplayData() {
    this.displayData = this.internships.map(i => ({
      id: i.id,
      subject: i.subject,
      company: i.company,
      city: i.city,
      studentName: i.student?.user?.firstName && i.student?.user?.lastName 
        ? `${i.student.user.firstName} ${i.student.user.lastName}` 
        : (i.studentId ? `Student #${i.studentId}` : 'N/A'),
      levelName: i.level?.name || 'N/A',
      status: i.status,
      startDate: i.startDate ? new Date(i.startDate).toLocaleDateString() : 'N/A',
      studentId: i.studentId || i.student?.id
    }));
  }

  getActionsForRole() {
    if (this.isAdmin) {
      return [
        { name: 'view', label: 'View', class: 'view' }
      ];
    }
    if (this.isTeacher) {
      return [
        { name: 'view', label: 'View', class: 'view' },
        { name: 'updateStatus', label: 'Update Status', class: 'edit' }
      ];
    }
    // Student - can edit/delete only own internships
    return [
      { name: 'view', label: 'View', class: 'view' },
      { name: 'edit', label: 'Edit', class: 'edit' },
      { name: 'delete', label: 'Delete', class: 'delete' }
    ];
  }

  onFilterChange() {
    if (this.isTeacher) {
      this.loadInternshipsForTeacher();
    } else {
      this.loadInternships();
    }
  }

  toggleMyInternships() {
    this.showOnlyMine = !this.showOnlyMine;
    this.loadInternships();
  }

  createInternship() {
    this.router.navigate(['/internships/create']);
  }

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    
    // Check if student can edit/delete this internship
    if (this.isStudent && (action === 'edit' || action === 'delete')) {
      if (row.studentId !== this.currentStudent?.id) {
        alert('You can only modify your own internships.');
        return;
      }
    }

    switch (action) {
      case 'view':
        this.router.navigate(['/internships', row.id]);
        break;
      case 'edit':
        this.router.navigate(['/internships', row.id, 'edit']);
        break;
      case 'updateStatus':
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
