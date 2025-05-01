import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoadnig: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  loginSubmet(form: FormGroup): void {
    this.isLoadnig = true;

    this.authService.handleLogin(form.value).subscribe({
      next: (res) => {
        // Store JWT token directly
        localStorage.setItem('token', res.token);
        this.authService.setUserToken();
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        this.isLoadnig = false;
        console.error(err);
        // Optional: Show error message
      },
    });
  }
}
