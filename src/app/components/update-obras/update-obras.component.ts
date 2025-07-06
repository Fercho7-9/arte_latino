import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ObrasService } from '../../services/obras/obras.service';

@Component({
  selector: 'app-update-obras',
  templateUrl: './update-obras.component.html'
})
export class UpdateObrasComponent implements OnInit {
  formData = {
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    estado: 'Disponible' // Default value
  };

  imagenPreview: string | ArrayBuffer | null = null;
  imagenArchivo: File | null = null;
  mensajeExito = '';
  mensajeError = '';
  isLoading = false;
  obraId: string = '';
  imagenActual: string = '';

  estados = ['Disponible', 'Comprado'];

  constructor(
    private router: Router,
    private obrasService: ObrasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.obraId = params['id'];
        this.cargarObra(this.obraId);
      }
    });
  }

  cargarObra(obraId: string) {
    this.isLoading = true;
    this.obrasService.obtenerObraPorId(obraId).subscribe({
      next: (obra) => {
        this.formData = {
          titulo: obra.titulo,
          descripcion: obra.descripcion,
          precio: obra.precio.toString(),
          categoria: obra.categoria,
          estado: obra.estado
        };
        if (obra.imagenes && obra.imagenes.length > 0) {
          this.imagenActual = obra.imagenes[0];
          this.imagenPreview = `http://localhost:5000/uploads/obras/${obra.imagenes[0]}`;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar la obra:', error);
        this.mensajeError = 'Error al cargar la obra';
        this.isLoading = false;
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        this.mensajeError = 'Solo se permiten imágenes en formato JPG, PNG o GIF';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.mensajeError = 'La imagen no debe superar los 5MB';
        return;
      }

      this.imagenArchivo = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
        this.mensajeError = '';
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    if (!this.validarFormulario()) return;

    this.isLoading = true;
    this.mensajeError = '';
    
    const formData = new FormData();
    formData.append('titulo', this.formData.titulo);
    formData.append('descripcion', this.formData.descripcion);
    formData.append('categoria', this.formData.categoria);
    formData.append('precio', this.formData.precio.toString());
    formData.append('estado', this.formData.estado);

    if (this.imagenArchivo) {
      formData.append('imagenes', this.imagenArchivo);
    }
    
    if (this.obraId && this.imagenActual && !this.imagenArchivo) {
      formData.append('imagenActual', this.imagenActual);
    }

    const request = this.obraId
      ? this.obrasService.actualizarObra(this.obraId, formData)
      : this.obrasService.createObra(formData);

    request.subscribe({
      next: (response) => {
        this.mensajeExito = this.obraId ? 'Obra actualizada exitosamente' : 'Obra creada exitosamente';
        setTimeout(() => this.regresar(), 1000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.mensajeError = error.error?.message || 'Error al procesar la obra. Por favor, intente nuevamente.';
        this.isLoading = false;
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.formData.titulo.trim()) {
      this.mensajeError = 'El título es requerido';
      return false;
    }
    if (!this.formData.descripcion.trim()) {
      this.mensajeError = 'La descripción es requerida';
      return false;
    }
    if (!this.formData.categoria) {
      this.mensajeError = 'La categoría es requerida';
      return false;
    }
    if (!this.formData.precio || isNaN(Number(this.formData.precio))) {
      this.mensajeError = 'El precio debe ser un número válido';
      return false;
    }
    if (!this.obraId && !this.imagenArchivo && !this.imagenPreview) {
      this.mensajeError = 'La imagen es requerida';
      return false;
    }
    return true;
  }

  regresar() {
    this.router.navigate(['/artista-view']);
  }
}