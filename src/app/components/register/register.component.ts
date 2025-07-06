import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        nacionalidad: ['', [Validators.required]],
        rol: ['usuario', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
  
      this.authService.register(formData).subscribe(
        (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          localStorage.setItem('userId', response.userId);
          this.successMessage = '¡Usuario registrado con éxito!';
          this.errorMessage = null;
  
          setTimeout(() => {
            this.router.navigate(['/select-rol']);
          }, 2000);
        },
        (error) => {
          this.successMessage = null;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
    }
  }
}