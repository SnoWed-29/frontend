import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="login-container">
      <app-card title="Login">
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <app-input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            [(ngModel)]="credentials.email"
            name="email"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <app-input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            [(ngModel)]="credentials.password"
            name="password"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <div class="form-actions">
            <app-button type="submit" variant="primary" size="lg" [disabled]="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </app-button>
          </div>

          <div class="register-link">
            Don't have an account? <a routerLink="/auth/register">Register here</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }
    .login-form {
      max-width: 400px;
      width: 100%;
    }
    .form-actions {
      margin-top: 1.5rem;
    }
    .form-actions app-button {
      width: 100%;
    }
    .register-link {
      text-align: center;
      margin-top: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .register-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
    .error-message {
      padding: 0.75rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const dashboardRoute = this.authService.getDashboardRoute();
        this.router.navigate([returnUrl || dashboardRoute]);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
