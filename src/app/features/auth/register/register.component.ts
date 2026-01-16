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
      <app-card title="Student Registration">
        <form (ngSubmit)="onSubmit()" class="register-form">
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <app-input
            id="firstName"
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            [(ngModel)]="formData.firstName"
            name="firstName"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <app-input
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            [(ngModel)]="formData.lastName"
            name="lastName"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <app-input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            [(ngModel)]="formData.email"
            name="email"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <app-input
            id="password"
            label="Password"
            type="password"
            placeholder="Choose a password (min 6 characters)"
            [(ngModel)]="formData.password"
            name="password"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <app-input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            [(ngModel)]="formData.confirmPassword"
            name="confirmPassword"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <div class="form-group">
            <label>Level</label>
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
            <label>Sector</label>
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
            id="academicYear"
            label="Academic Year"
            type="text"
            placeholder="e.g., 2025-2026"
            [(ngModel)]="formData.academicYear"
            name="academicYear"
            [required]="true"
            [disabled]="isLoading"
          ></app-input>

          <div class="form-actions">
            <app-button type="submit" variant="primary" size="lg" [disabled]="isLoading">
              {{ isLoading ? 'Creating account...' : 'Register' }}
            </app-button>
          </div>

          <div class="login-link">
            Already have an account? <a routerLink="/auth/login">Login here</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }
    .register-form {
      max-width: 400px;
      width: 100%;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      background-color: white;
    }
    .form-select:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
    .form-actions {
      margin-top: 1.5rem;
    }
    .form-actions app-button {
      width: 100%;
    }
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .login-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    .login-link a:hover {
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
