import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    rol: string;
    blockStatus?: {
      isBlocked: boolean;
      blockReason: string;
      blockedAt: Date | null;
    };
  };
  message: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;
      this.errorMessage = '';

      this.authService.login({ email, password }).subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;
          
          if (!response.user || !response.user.rol) {
            this.errorMessage = 'Error: Información de usuario incompleta';
            return;
          }

          if (response.token) {
            localStorage.setItem('token', response.token);
            this.authService.updateAuthState(true, response.user);
          }

          // Redirección basada en el rol
          switch (response.user.rol.toLowerCase()) {
            case 'usuario':
              this.router.navigate(['/usuario-view']);
              break;
            case 'artista':
              this.router.navigate(['/artista-view']);
              break;
            case 'admin':
              this.router.navigate(['/admin']);
              break;
            default:
              this.errorMessage = 'Rol no reconocido';
              break;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, intente nuevamente.';
          console.error('Error de autenticación:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
  
  onPasswordRecovery() {
    this.router.navigate(['/password-reset']);
  }
}