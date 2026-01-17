import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group" [class.has-error]="error" [class.has-value]="value">
      <label *ngIf="label" [for]="id" class="form-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      <div class="input-wrapper">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="form-control"
          [class.focused]="isFocused"
        />
        <div class="input-highlight"></div>
      </div>
      <span *ngIf="error" class="error-message">
        <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </span>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.25rem;
      position: relative;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }
    
    .required {
      color: #ef4444;
      margin-left: 0.125rem;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      color: #1e293b;
    }
    
    .form-control::placeholder {
      color: #94a3b8;
    }
    
    .form-control:hover:not(:disabled) {
      border-color: #cbd5e1;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }
    
    .form-control:disabled {
      background-color: #f8fafc;
      cursor: not-allowed;
      color: #94a3b8;
    }
    
    .input-highlight {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 1px;
    }
    
    .form-control:focus ~ .input-highlight {
      width: calc(100% - 4px);
    }
    
    .has-error .form-control {
      border-color: #fca5a5;
      background-color: #fef2f2;
    }
    
    .has-error .form-control:focus {
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin-top: 0.5rem;
      color: #dc2626;
      font-size: 0.8125rem;
      font-weight: 500;
      animation: fadeInDown 0.2s ease-out;
    }
    
    .error-icon {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';

  value = '';
  isFocused = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
