import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-update-bio-user',
  templateUrl: './update-bio-user.component.html',
  styleUrls: ['./update-bio-user.component.css']
})
export class UpdateBioUserComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  nombre: string = '';
  correo: string = '';
  nacionalidad: string = '';
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  userId: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id || currentUser._id;
      this.nombre = currentUser.name || '';
      this.correo = currentUser.email || '';
      this.nacionalidad = currentUser.nacionalidad || '';
      if (currentUser.imagen) {
        this.previewUrls = Array.isArray(currentUser.imagen) 
          ? currentUser.imagen 
          : [currentUser.imagen];
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      this.selectedFiles = [file];  // Solo se guarda una imagen

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls = [e.target.result];  // Solo se agrega una imagen al arreglo
      };
      reader.readAsDataURL(file);
    }

    // Reset file input
    this.fileInput.nativeElement.value = '';
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  async guardarDatos(): Promise<void> {
    try {
      if (!this.userId) {
        console.error('No se encontró ID de usuario');
        this.router.navigate(['/login']);
        return;
      }

      const formData = new FormData();
      formData.append('name', this.nombre);
      formData.append('email', this.correo);
      formData.append('nacionalidad', this.nacionalidad);
      
      // Append the selected image
      if (this.selectedFiles.length > 0) {
        formData.append('imagen', this.selectedFiles[0]);
      }

      const response = await this.userService.updateUserProfile(this.userId, formData).toPromise();
      
      if (response && response.user) {
        // Update auth state with new user data
        this.authService.updateAuthState(true, response.user);
        this.router.navigate(['/usuario-view']);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  }

  cancelarEdicion(): void {
    this.router.navigate(['/usuario-view']);
  }
}
