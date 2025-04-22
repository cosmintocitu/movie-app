import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterDto } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Import the SCSS file
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]], // Added email field with validation
    password: ['', [Validators.required, Validators.minLength(6)]], // Added minLength validator
  });
  errorMessage: string = '';
  isLoading: boolean = false;
  formSubmitted: boolean = false; // To trigger immediate validation feedback

  constructor(private readonly fb: FormBuilder, private readonly api: ApiService, private readonly router: Router) {}

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register() {
    this.formSubmitted = true; // Mark the form as submitted
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // Clear any previous error messages

    this.api.register(this.registerForm.value as RegisterDto).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = 'Registration failed. Please try again.'; // Display a generic error message
        if (err?.error?.message) {
          this.errorMessage = err.error.message; // Use backend-specific error message if available
        }
        this.isLoading = false;
      },
    });
  }
}