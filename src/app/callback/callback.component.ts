import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Procesando autenticación...</p>`,
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Leer fragmentos de la URL después de la redirección de Google
    this.route.fragment.subscribe((fragment) => {
      const params = new URLSearchParams(fragment || '');
      const token = params.get('access_token');
      const idToken = params.get('id_token');

      if (token && idToken) {
        console.log('Access Token:', token);
        console.log('ID Token:', idToken);

        // Guarda los tokens en localStorage o maneja tu lógica
        localStorage.setItem('access_token', token);
        localStorage.setItem('id_token', idToken);
      } else {
        console.error('No se recibieron tokens después de la redirección');
      }
    });
  }
}
