import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  apiError: string = '';
  isLoading: boolean = false;

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\w{6,}$/),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10,15}$/),
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(10),
      Validators.max(100),
      Validators.pattern(/^[0-9]+$/),
    ]),
    gender: new FormControl('', Validators.required),
  });
  registerSubmit(form: FormGroup) {
    this.isLoading = true;

    this.authService.handleRegister(form.value).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.log(err);
        this.apiError =
          err.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
