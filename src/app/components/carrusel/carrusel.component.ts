import { Component, OnInit } from '@angular/core';
import { ObrasService } from '../../services/obras/obras.service';

interface Obra {
  _id: string;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  artista_id: {
    user_id: {
      name: string;
    }
  };
}

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent implements OnInit {
  currentSlide = 0;
  slides: any[] = [];

  constructor(private obrasService: ObrasService) {}

  ngOnInit() {
    this.cargarObrasDestacadas();
    this.startSlideshow();
  }

  cargarObrasDestacadas() {
    this.obrasService.obtenerTodasLasObras().subscribe({
      next: (obras: any) => {
        // Combine all obras into a single array
        const todasLasObras = Object.values(obras).flat();
        
        // Get first 3 obras that have images
        const obrasConImagenes = (todasLasObras as Obra[])
          .filter(obra => obra.imagenes && obra.imagenes.length > 0)
          .slice(0, 3);

        this.slides = obrasConImagenes.map(obra => ({
          image: `http://localhost:5000/uploads/obras/${obra.imagenes[0]}`,
          title: obra.titulo,
          description: `Por ${obra.artista_id?.user_id?.name}`
        }));
      },
      error: (error) => {
        console.error('Error al cargar las obras destacadas:', error);
      }
    });
  }


  startSlideshow() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}