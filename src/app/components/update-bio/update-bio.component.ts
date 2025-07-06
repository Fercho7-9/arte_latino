import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtistaService } from '../../services/artistas/artistas.service';

@Component({
  selector: 'app-update-bio',
  templateUrl: './update-bio.component.html',
  styleUrls: ['./update-bio.component.css']
})
export class UpdateBioComponent implements OnInit {
  formData = {
    nombre: '',
    biografia: '',
    telefono: '',
    correo: '',
    instagram: '',
    facebook: ''
  };

  imagenPreview: string | ArrayBuffer | null = null;
  imagenArchivo: File | null = null;

  constructor(
    private router: Router,
    private artistaService: ArtistaService
  ) {}

  ngOnInit() {
    this.cargarDatosArtista();
  }

  private cargarDatosArtista() {
    this.artistaService.obtenerArtista().subscribe(
      (data) => {
        if (data) {
          // Si el artista está bloqueado, redirigir a la vista principal
          if (data.blockStatus?.isBlocked) {
            this.router.navigate(['/artista-view']);
            return;
          }
          
          this.formData = {
            ...this.formData,
            ...data,
            instagram: data.redes_sociales?.instagram || '',
            facebook: data.redes_sociales?.facebook || ''
          };
        }
      },
      (error) => console.error('Error al cargar datos del artista:', error)
    );
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenArchivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(this.imagenArchivo);
    }
  }

  guardarCambios() {
    const formData = new FormData();
    
    // Agregar campos básicos
    Object.keys(this.formData).forEach(key => {
      if (key !== 'instagram' && key !== 'facebook') {
        formData.append(key, this.formData[key as keyof typeof this.formData]);
      }
    });

    // Agregar redes sociales
    formData.append('instagram', this.formData.instagram);
    formData.append('facebook', this.formData.facebook);

    // Agregar imagen si existe
    if (this.imagenArchivo) {
      formData.append('imagen', this.imagenArchivo);
    }

    this.artistaService.guardarArtista(formData).subscribe(
      (response) => {
        console.log('Datos guardados correctamente:', response);
        // Aquí podrías agregar una notificación de éxito
        this.regresar();
      },
      
      (error) => {
        console.error('Error al guardar los datos:', error);
        // Aquí podrías agregar una notificación de error
      }
    );
  }

  regresar() {
    this.router.navigate(['/artista-view']);
  }
}