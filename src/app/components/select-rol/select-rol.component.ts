import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ArtistaService } from '../../services/artistas/artistas.service';

@Component({
  selector: 'app-select-rol',
  templateUrl: './select-rol.component.html',
  styleUrls: ['./select-rol.component.css'],
})
export class SelectRolComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private artistaService: ArtistaService,
    private router: Router
  ) {}

  selectRole(role: string): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.errorMessage = 'No se encontró información del usuario. Por favor, inicia sesión.';
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id || user._id;

    if (!userId) {
      this.errorMessage = 'No se encontró el ID de usuario. Por favor, inicia sesión.';
      return;
    }

    this.authService.updateRole(userId, role).subscribe({
      next: async (response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', role);
          
          if (response.user) {
            this.authService.updateAuthState(true, response.user);
          }

          // Si el rol es artista, crear automáticamente el perfil de artista bloqueado
          if (role === 'artista') {
            const formData = new FormData();
            formData.append('biografia', '');
            formData.append('telefono', '');
            formData.append('correo', response.user.email || '');
            formData.append('instagram', '');
            formData.append('facebook', '');

            try {
              await this.artistaService.guardarArtista(formData).toPromise();
            } catch (error) {
              console.error('Error creating artist profile:', error);
            }
          }
        }
        
        this.successMessage = 'Rol actualizado con éxito.';
        this.errorMessage = null;

        const targetRoute = role === 'usuario' ? '/usuario-view' : '/artista-view';
        setTimeout(() => {
          this.router.navigate([targetRoute]);
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.successMessage = null;
        this.errorMessage = 'Error al actualizar el rol: ' + (error?.error?.message || 'Error desconocido');
      }
    });
  }
}