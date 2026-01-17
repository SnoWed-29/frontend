import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div class="card-header" *ngIf="title">
        <div class="card-header-content">
          <div class="card-icon" *ngIf="icon">{{ icon }}</div>
          <h3>{{ title }}</h3>
        </div>
        <div class="card-header-actions">
          <ng-content select="[header-actions]"></ng-content>
        </div>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(226, 232, 240, 0.8);
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .card:hover {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08);
      transform: translateY(-2px);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
    }
    
    .card-header-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .card-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: -0.025em;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() icon?: string;
  @Input() hasFooter = false;

  get cardClasses(): string {
    return 'card';
  }
}
