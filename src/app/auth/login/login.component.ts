import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginDto } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  // Error state variables
  isLoading = false;
  errorMessage: string | null = null;
  formSubmitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly router: Router
  ) {}

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  login() {
    this.formSubmitted = true;
    this.errorMessage = null;

    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;

    this.api.login(this.form.value as LoginDto).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.isLoading = false;

        // Handle specific error cases
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.message.includes('Network error')) {
          this.errorMessage = 'Network error. Please check your internet connection.';
        } else if (err.message.includes('Authentication required')) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }

        console.error('Login failed:', err);
      },
    });
  }
}