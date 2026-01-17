import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AuthService } from '../../../core/services/auth.service';
import { MetadataService } from '../../../core/services/metadata.service';
import { Level, Sector } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="register-container">
      <div class="register-background">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
      </div>
      
      <div class="register-content">
        <div class="register-header">
          <div class="logo">
            <span class="logo-icon">🎓</span>
            <span class="logo-text">InternTrack</span>
          </div>
          <p class="tagline">Start your internship journey</p>
        </div>
        
        <div class="register-card">
          <div class="card-header">
            <h1>Create Account</h1>
            <p>Join as a student and manage your internships</p>
          </div>
          
          <form (ngSubmit)="onSubmit()" class="register-form">
            <div class="error-message" *ngIf="errorMessage">
              <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <div class="form-row">
              <app-input
                id="firstName"
                label="First Name"
                type="text"
                placeholder="John"
                [(ngModel)]="formData.firstName"
                name="firstName"
                [required]="true"
                [disabled]="isLoading"
              ></app-input>

              <app-input
                id="lastName"
                label="Last Name"
                type="text"
                placeholder="Doe"
                [(ngModel)]="formData.lastName"
                name="lastName"
                [required]="true"
                [disabled]="isLoading"
              ></app-input>
            </div>

            <app-input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="formData.email"
              name="email"
              [required]="true"
              [disabled]="isLoading"
            ></app-input>

            <div class="form-row">
              <app-input
                id="password"
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                [(ngModel)]="formData.password"
                name="password"
                [required]="true"
                [disabled]="isLoading"
              ></app-input>

              <app-input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                [(ngModel)]="formData.confirmPassword"
                name="confirmPassword"
                [required]="true"
                [disabled]="isLoading"
              ></app-input>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Level <span class="required">*</span></label>
                <select 
                  [(ngModel)]="formData.levelId" 
                  name="levelId" 
                  class="form-select" 
                  [disabled]="isLoading || loadingLevels"
                  (change)="onLevelChange()"
                >
                  <option [ngValue]="null">Select your level</option>
                  <option *ngFor="let level of levels" [ngValue]="level.id">
                    {{ level.name }}
                  </option>
                </select>
              </div>

              <div class="form-group" *ngIf="showSectorSelect">
                <label>Sector <span class="required">*</span></label>
                <select 
                  [(ngModel)]="formData.sectorId" 
                  name="sectorId" 
                  class="form-select" 
                  [disabled]="isLoading || loadingSectors"
                >
                  <option [ngValue]="null">Select your sector</option>
                  <option *ngFor="let sector of availableSectors" [ngValue]="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </div>
              
              <app-input
                *ngIf="!showSectorSelect"
                id="academicYear"
                label="Academic Year"
                type="text"
                placeholder="2025-2026"
                [(ngModel)]="formData.academicYear"
                name="academicYear"
                [required]="true"
                [disabled]="isLoading"
              ></app-input>
            </div>

            <app-input
              *ngIf="showSectorSelect"
              id="academicYear"
              label="Academic Year"
              type="text"
              placeholder="2025-2026"
              [(ngModel)]="formData.academicYear"
              name="academicYear"
              [required]="true"
              [disabled]="isLoading"
            ></app-input>

            <div class="form-actions">
              <app-button type="submit" variant="primary" size="lg" [disabled]="isLoading">
                <span *ngIf="!isLoading">Create Account</span>
                <span *ngIf="isLoading" class="loading-text">
                  <span class="spinner"></span>
                  Creating account...
                </span>
              </app-button>
            </div>

            <div class="login-link">
              <span>Already have an account?</span>
              <a routerLink="/auth/login">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
      padding: 2rem 1rem;
    }
    
    .register-background {
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
      left: -200px;
      animation-delay: 0s;
    }
    
    .bg-shape-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      bottom: -100px;
      right: -100px;
      animation-delay: 2s;
    }
    
    .bg-shape-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #10b981 0%, #6366f1 100%);
      top: 30%;
      right: 20%;
      animation-delay: 4s;
    }
    
    .register-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 560px;
      animation: fadeInUp 0.6s ease-out;
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .logo-icon {
      font-size: 2.5rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .logo-text {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.025em;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9375rem;
    }
    
    .register-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .card-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .card-header h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.375rem 0;
      letter-spacing: -0.025em;
    }
    
    .card-header p {
      color: #64748b;
      margin: 0;
      font-size: 0.9375rem;
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .required {
      color: #ef4444;
    }
    
    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      background-color: white;
      color: #1e293b;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .form-select:hover:not(:disabled) {
      border-color: #cbd5e1;
    }
    
    .form-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }
    
    .form-select:disabled {
      background-color: #f8fafc;
      cursor: not-allowed;
      color: #94a3b8;
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
    
    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #64748b;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
    }
    
    .login-link a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    
    .login-link a:hover {
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
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    levelId: null as number | null,
    sectorId: null as number | null,
    academicYear: '2025-2026'
  };

  levels: Level[] = [];
  sectors: Sector[] = [];
  availableSectors: Sector[] = [];
  
  isLoading = false;
  loadingLevels = false;
  loadingSectors = false;
  errorMessage = '';
  showSectorSelect = false;

  constructor(
    private authService: AuthService,
    private metadataService: MetadataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLevels();
    this.loadSectors();
  }

  loadLevels() {
    this.loadingLevels = true;
    this.metadataService.getLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
        this.loadingLevels = false;
      },
      error: (error) => {
        console.error('Error loading levels:', error);
        this.loadingLevels = false;
        this.errorMessage = 'Failed to load levels. Please refresh the page.';
      }
    });
  }

  loadSectors() {
    this.loadingSectors = true;
    this.metadataService.getSectors().subscribe({
      next: (sectors) => {
        this.sectors = sectors;
        this.loadingSectors = false;
      },
      error: (error) => {
        console.error('Error loading sectors:', error);
        this.loadingSectors = false;
      }
    });
  }

  onLevelChange() {
    const selectedLevel = this.levels.find(l => l.id === this.formData.levelId);
    if (!selectedLevel) {
      this.showSectorSelect = false;
      this.availableSectors = [];
      this.formData.sectorId = null;
      return;
    }

    // B1 and B2 don't need to select sector (auto-assigned)
    // B3, M1, M2 must select sector
    const levelName = selectedLevel.name;
    this.showSectorSelect = !['B1', 'B2'].includes(levelName);

    if (this.showSectorSelect) {
      this.availableSectors = this.sectors;
    } else {
      this.formData.sectorId = null;
      this.availableSectors = [];
    }
  }

  onSubmit() {
    // Validation
    if (!this.formData.firstName || !this.formData.lastName || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.formData.levelId) {
      this.errorMessage = 'Please select your level';
      return;
    }

    if (this.showSectorSelect && !this.formData.sectorId) {
      this.errorMessage = 'Please select your sector';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    if (!this.formData.academicYear) {
      this.errorMessage = 'Please enter the academic year';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { confirmPassword, ...registerData } = this.formData;

    this.authService.register(registerData as any).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
