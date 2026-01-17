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
      <div class="login-background">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
      </div>
      
      <div class="login-content">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">🎓</span>
            <span class="logo-text">InternTrack</span>
          </div>
          <p class="tagline">Manage your internships with ease</p>
        </div>
        
        <div class="login-card">
          <div class="card-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>
          
          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="error-message" *ngIf="errorMessage">
              <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <app-input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
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
                <span *ngIf="!isLoading">Sign In</span>
                <span *ngIf="isLoading" class="loading-text">
                  <span class="spinner"></span>
                  Signing in...
                </span>
              </app-button>
            </div>

            <div class="register-link">
              <span>Don't have an account?</span>
              <a routerLink="/auth/register">Create one now</a>
            </div>
          </form>
        </div>
        
        <div class="login-footer">
          <p>© 2025 InternTrack. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
    }
    
    .login-background {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
      animation: float 8s ease-in-out infinite;
    }
    
    .bg-shape-1 {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      top: -200px;
      right: -200px;
      animation-delay: 0s;
    }
    
    .bg-shape-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      bottom: -100px;
      left: -100px;
      animation-delay: 2s;
    }
    
    .bg-shape-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
      top: 50%;
      left: 50%;
      animation-delay: 4s;
    }
    
    .login-content {
      position: relative;
      z-index: 10;
      padding: 2rem;
      width: 100%;
      max-width: 480px;
      animation: fadeInUp 0.6s ease-out;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .logo-icon {
      font-size: 3rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .logo-text {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.025em;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .card-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.025em;
    }
    
    .card-header p {
      color: #64748b;
      margin: 0;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-actions {
      margin-top: 1rem;
    }
    
    .form-actions app-button {
      width: 100%;
    }
    
    .form-actions ::ng-deep button {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
    }
    
    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #64748b;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
    }
    
    .register-link a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    
    .register-link a:hover {
      color: #4f46e5;
      text-decoration: underline;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #b91c1c;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border: 1px solid #fecaca;
      animation: shake 0.4s ease-out;
    }
    
    .error-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }
    
    .login-footer {
      text-align: center;
      margin-top: 2rem;
    }
    
    .login-footer p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.875rem;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(3deg); }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
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
