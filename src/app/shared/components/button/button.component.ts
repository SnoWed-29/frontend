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
      <span class="btn-content">
        <ng-content></ng-content>
      </span>
      <span class="btn-shine"></span>
    </button>
  `,
  styles: [`
    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      font-size: 0.875rem;
      overflow: hidden;
      letter-spacing: 0.025em;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    
    .btn-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .btn:hover .btn-shine {
      left: 100%;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none;
    }
    
    .btn:disabled:hover .btn-shine {
      left: -100%;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    
    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #475569 0%, #334155 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(71, 85, 105, 0.4);
    }
    
    .btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    .btn-success:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
    }
    
    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      border-radius: 0.375rem;
    }
    
    .btn-lg {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
      border-radius: 0.625rem;
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
