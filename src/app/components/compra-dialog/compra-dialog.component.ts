import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComprasService } from '../../services/compras/compras.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-compra-dialog',
  templateUrl: './compra-dialog.component.html',
  styleUrl: './compra-dialog.component.css'
})
export class CompraDialogComponent {
  forma: FormGroup;
  isAuthenticated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private comprasService: ComprasService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<CompraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forma = this.fb.group({
      numero_tarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      nombre_titular: ['', Validators.required],
      fecha_vencimiento: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      correo: ['', [Validators.required, Validators.email]]
    });

    this.authService.authState$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
  }

  goToLogin() {
    this.dialogRef.close({ action: 'login' });
  }

  goToRegister() {
    this.dialogRef.close({ action: 'register' });
  }

  async onSubmit() {
    if (this.forma.valid) {
      try {
        const metodo_pago = {
          numero_tarjeta: this.forma.get('numero_tarjeta')?.value,
          nombre_titular: this.forma.get('nombre_titular')?.value,
          fecha_vencimiento: this.forma.get('fecha_vencimiento')?.value,
          cvv: this.forma.get('cvv')?.value
        };

        await this.comprasService.realizarCompra(this.data.obras, metodo_pago).toPromise();
        await this.sendEmail(this.data.obras);
        this.dialogRef.close({ success: true });
      } catch (error) {
        console.error('Error en la compra:', error);
        this.dialogRef.close({ success: false, error });
      }
    }
  }

  async sendEmail(obras: any[]) {
    emailjs.init('vSG3k4AbU4dZxTv6y');
    
    const totalPrecio = obras.reduce((sum, obra) => sum + obra.precio, 0);
    const obrasList = obras.map(obra => obra.titulo).join(', ');

    const templateParams = {
      to_email: this.forma.get('correo')?.value,
      from_name: this.forma.get('nombre_titular')?.value,
      from_email: this.forma.get('correo')?.value,
      obra_titulo: obrasList,
      obra_precio: totalPrecio,
      fecha_compra: new Date().toLocaleDateString(),
      message: `¡Gracias por tu compra! Has adquirido las siguientes obras: ${obrasList} por un precio total de $${totalPrecio}. Fecha de la compra: ${new Date().toLocaleDateString()}`
    };

    await emailjs.send(
      'service_qmp19fg',
      'template_tnnjuuu',
      templateParams
    );
    
    console.log('Email sent successfully!');
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }
}