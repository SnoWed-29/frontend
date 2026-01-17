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
            <th *ngFor="let column of columns; let i = index" [style.animation-delay]="(i * 0.05) + 's'">
              {{ column.label }}
            </th>
            <th *ngIf="actions.length > 0">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" 
              class="table-row"
              [style.animation-delay]="(i * 0.05) + 's'">
            <td *ngFor="let column of columns">
              <span [class]="getCellClass(column.key, getValue(row, column.key))">
                {{ getValue(row, column.key) }}
              </span>
            </td>
            <td *ngIf="actions.length > 0" class="actions">
              <div class="action-buttons">
                <button 
                  *ngFor="let action of actions"
                  [class]="'action-btn action-' + action.class"
                  (click)="onAction(action.name, row)"
                  [title]="action.label">
                  <span class="action-icon">{{ getActionIcon(action.class) }}</span>
                  <span class="action-label">{{ action.label }}</span>
                </button>
              </div>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="empty">
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No data available</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      border-radius: 0.75rem;
    }
    
    .table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .table thead {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }
    
    .table th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-weight: 700;
      color: #475569;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e2e8f0;
      animation: fadeInDown 0.3s ease-out forwards;
      opacity: 0;
    }
    
    .table-row {
      animation: fadeInUp 0.4s ease-out forwards;
      opacity: 0;
      transition: all 0.2s ease;
    }
    
    .table-row:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    }
    
    .table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 0.9375rem;
    }
    
    .table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .actions {
      white-space: nowrap;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    
    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    
    .action-icon {
      font-size: 0.875rem;
    }
    
    .action-view {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
    }
    
    .action-view:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    
    .action-edit {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    .action-edit:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    
    .action-delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
    
    .action-delete:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }
    
    .empty {
      text-align: center;
      padding: 3rem !important;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    
    .empty-icon {
      font-size: 3rem;
      opacity: 0.6;
    }
    
    .empty-state p {
      color: #94a3b8;
      font-size: 0.9375rem;
      font-weight: 500;
    }
    
    /* Status badge styling */
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    
    .status-draft {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #64748b;
    }
    
    .status-pending {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
    }
    
    .status-approved {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
    }
    
    .status-in_progress {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1e40af;
    }
    
    .status-completed {
      background: linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%);
      color: #047857;
    }
    
    .status-rejected {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

  getCellClass(key: string, value: any): string {
    if (key === 'status' && value) {
      return `status-badge status-${value.toLowerCase().replace(' ', '_')}`;
    }
    return '';
  }

  getActionIcon(actionClass: string): string {
    const icons: { [key: string]: string } = {
      'view': '👁️',
      'edit': '✏️',
      'delete': '🗑️'
    };
    return icons[actionClass] || '';
  }

  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }
}
