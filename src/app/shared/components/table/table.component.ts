import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th *ngFor="let column of columns">{{ column.label }}</th>
            <th *ngIf="actions.length > 0">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td *ngFor="let column of columns">
              {{ getValue(row, column.key) }}
            </td>
            <td *ngIf="actions.length > 0" class="actions">
              <button 
                *ngFor="let action of actions"
                [class]="'action-btn ' + action.class"
                (click)="onAction(action.name, row)">
                {{ action.label }}
              </button>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="empty">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table thead {
      background-color: #f9fafb;
    }
    .table th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    .table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .table tbody tr:hover {
      background-color: #f9fafb;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .action-btn {
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: opacity 0.2s;
    }
    .action-btn:hover {
      opacity: 0.8;
    }
    .action-btn.view {
      background-color: #3b82f6;
      color: white;
    }
    .action-btn.edit {
      background-color: #10b981;
      color: white;
    }
    .action-btn.delete {
      background-color: #ef4444;
      color: white;
    }
    .empty {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
    }
  `]
})
export class TableComponent {
  @Input() columns: Array<{ key: string; label: string }> = [];
  @Input() data: any[] = [];
  @Input() actions: Array<{ name: string; label: string; class: string }> = [];
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  getValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }
}
