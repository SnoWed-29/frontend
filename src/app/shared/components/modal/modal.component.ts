import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="close()" @fadeIn>
      <div class="modal-content" (click)="$event.stopPropagation()" @scaleIn>
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-btn" (click)="close()">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer" *ngIf="hasFooter">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    
    .modal-content {
      background: white;
      border-radius: 1.25rem;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
      border-radius: 1.25rem 1.25rem 0 0;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.375rem;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: -0.025em;
    }
    
    .close-btn {
      background: transparent;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #94a3b8;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      background: #fee2e2;
      color: #ef4444;
    }
    
    .close-btn svg {
      width: 1.5rem;
      height: 1.5rem;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      border-radius: 0 0 1.25rem 1.25rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() hasFooter = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.closed.emit();
  }
}
