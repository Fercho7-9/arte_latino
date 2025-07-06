import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });

    emailjs.init("vSG3k4AbU4dZxTv6y"); 
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const templateParams = {
        from_name: this.contactForm.value.nombre,
        from_email: this.contactForm.value.email,
        message: this.contactForm.value.mensaje,
        to_email: 'kiolpe69@gmail.com'
      };

      emailjs.send(
        'service_qmp19fg', // Replace with your EmailJS service ID
        'template_borlm3b', // Replace with your EmailJS template ID
        templateParams
      ).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          alert('Mensaje enviado correctamente');
          this.contactForm.reset();
        },
        (err) => {
          console.log('FAILED...', err);
          alert('Error al enviar el mensaje');
        }
      );
    }
  }
}