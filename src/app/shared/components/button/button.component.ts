import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.875rem;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }
    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }
    .btn-success {
      background-color: #10b981;
      color: white;
    }
    .btn-success:hover:not(:disabled) {
      background-color: #059669;
    }
    .btn-danger {
      background-color: #ef4444;
      color: white;
    }
    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }
    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;

  get buttonClasses(): string {
    return `btn btn-${this.variant} btn-${this.size}`;
  }

  handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
