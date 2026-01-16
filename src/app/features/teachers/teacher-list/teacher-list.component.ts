import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SectorName } from '../../../core/models';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, TableComponent, ButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <div class="header">
        <h1>Teachers</h1>
        <app-button variant="primary" (click)="createTeacher()">
          + New Teacher
        </app-button>
      </div>

      <app-card>
        <app-table
          [columns]="columns"
          [data]="teachers"
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
export class TeacherListComponent {
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'sector.name', label: 'Sector' },
    { key: 'phone', label: 'Phone' }
  ];

  actions = [
    { name: 'view', label: 'View', class: 'view' },
    { name: 'edit', label: 'Edit', class: 'edit' },
    { name: 'delete', label: 'Delete', class: 'delete' }
  ];

  teachers: any[] = [
    {
      id: 1,
      firstName: 'Dr. Smith',
      lastName: 'Anderson',
      email: 'smith.anderson@example.com',
      phone: '+33 6 11 22 33 44',
      sector: { id: 1, name: SectorName.INFORMATIQUE }
    },
    {
      id: 2,
      firstName: 'Prof. Emily',
      lastName: 'Brown',
      email: 'emily.brown@example.com',
      phone: '+33 6 22 33 44 55',
      sector: { id: 2, name: SectorName.MARKETING }
    },
    {
      id: 3,
      firstName: 'Dr. Michael',
      lastName: 'Davis',
      email: 'michael.davis@example.com',
      phone: '+33 6 33 44 55 66',
      sector: { id: 3, name: SectorName.DESIGN }
    },
    {
      id: 4,
      firstName: 'Prof. Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+33 6 44 55 66 77',
      sector: { id: 4, name: SectorName.BUSINESS }
    }
  ];

  constructor(private router: Router) {}

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
        this.router.navigate(['/teachers', row.id, 'edit']);
        break;
      case 'delete':
        console.log('Delete teacher:', row.id);
        break;
    }
  }
}
