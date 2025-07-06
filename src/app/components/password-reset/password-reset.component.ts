import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  emailForm: FormGroup;
  codeForm: FormGroup;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  recoveryCode: string = '';
  codeSent: boolean = false;
  userEmail: string = '';
  users: any[] = [];

  private readonly EMAIL_SERVICE_ID = 'service_zet6f6u';
  private readonly EMAIL_TEMPLATE_ID = 'template_jdyar6h';
  private readonly EMAIL_PUBLIC_KEY = '4pWc8OJ0fM6RPqYY8';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    emailjs.init(this.EMAIL_PUBLIC_KEY);
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await firstValueFrom(this.userService.getAllUsers());
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  async sendEmail() {
    if (!this.emailForm.valid) {
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.emailForm.get('email')?.value;
    
    const userExists = this.users.some(user => user.email === email);
    if (!userExists) {
      this.errorMessage = 'El correo electrónico no está registrado en el sistema.';
      this.loading = false;
      return;
    }

    this.userEmail = email;
    this.recoveryCode = this.generateRecoveryCode();

    try {
      const templateParams = {
        user_email: email,
        user_name: email.split('@')[0],
        code: this.recoveryCode,
        html_message: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola ${email.split('@')[0]},</p>
            <p>Tu código de recuperación de contraseña es:</p>
            <h3 style="color: #C59955; font-size: 24px;">${this.recoveryCode}</h3>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este código, puedes ignorar este correo.</p>
            <br>
            <p>Saludos,</p>
            <p>Equipo de Arte Latino</p>
          </div>
        `
      };

      const response = await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.EMAIL_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('Email enviado exitosamente:', response);
        this.successMessage = 'Código enviado exitosamente. Por favor, revisa tu correo.';
        this.codeSent = true;
      } else {
        throw new Error('Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      this.errorMessage = 'Hubo un error al enviar el correo. Por favor, intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  async verifyCode() {
    if (!this.codeForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const submittedCode = this.codeForm.get('code')?.value;
    const newPassword = this.codeForm.get('newPassword')?.value;

    if (submittedCode === this.recoveryCode) {
      try {
        await firstValueFrom(this.authService.resetPassword(this.userEmail, newPassword));
        this.successMessage = 'Contraseña actualizada exitosamente.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        this.errorMessage = 'Error al actualizar la contraseña. Por favor, intenta nuevamente.';
      }
    } else {
      this.errorMessage = 'Código incorrecto. Por favor, verifica e intenta nuevamente.';
    }

    this.loading = false;
  }

  resendCode() {
    this.sendEmail();
  }

  private generateRecoveryCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}