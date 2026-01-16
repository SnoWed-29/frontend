import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Reports</h1>
      </div>

      <app-card>
        <app-table
          [columns]="columns"
          [data]="reports"
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
  `]
})
export class ReportListComponent {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'internship.title', label: 'Internship' },
    { key: 'internship.student.firstName', label: 'Student' },
    { key: 'submittedAt', label: 'Submitted' },
    { key: 'grade', label: 'Grade' }
  ];

  actions = [
    { name: 'view', label: 'View', class: 'view' },
    { name: 'grade', label: 'Grade', class: 'edit' }
  ];

  reports: any[] = [
    {
      id: 1,
      title: 'Monthly Progress Report - January',
      content: 'First month of internship completed...',
      submittedAt: '2024-01-31',
      grade: 18,
      internship: {
        id: 1,
        title: 'Full Stack Developer',
        student: { firstName: 'John', lastName: 'Doe' }
      }
    },
    {
      id: 2,
      title: 'Monthly Progress Report - February',
      content: 'Second month of internship...',
      submittedAt: '2024-02-28',
      grade: null,
      internship: {
        id: 1,
        title: 'Full Stack Developer',
        student: { firstName: 'John', lastName: 'Doe' }
      }
    },
    {
      id: 3,
      title: 'Final Internship Report',
      content: 'Complete internship summary...',
      submittedAt: '2024-03-15',
      grade: 16,
      internship: {
        id: 2,
        title: 'Frontend Developer',
        student: { firstName: 'Jane', lastName: 'Smith' }
      }
    }
  ];

  constructor(private router: Router) {}

  onAction(event: { action: string; row: any }) {
    const { action, row } = event;
    switch (action) {
      case 'view':
        this.router.navigate(['/reports', row.id]);
        break;
      case 'grade':
        console.log('Grade report:', row.id);
        break;
    }
  }
}
