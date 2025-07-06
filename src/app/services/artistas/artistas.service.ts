  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable, BehaviorSubject, map } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ArtistaService {
    private apiUrl = 'http://localhost:5000/api/artista';
    private artistaDataSubject = new BehaviorSubject<any>(null);
    artistaData$ = this.artistaDataSubject.asObservable();

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    obtenerArtista(): Observable<any> {
      return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
        map(artista => {
          if (artista) {
            this.artistaDataSubject.next(artista);
          }
          return artista;
        })
      );
    }

    obtenerTodosArtistas(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/todos`).pipe(
        map(artistas => {
          return artistas.map((artista: any) => ({
            id: artista._id,
            name: artista.user_id?.name || 'Sin nombre',
            nacionalidad: artista.user_id?.nacionalidad || 'No especificada',
            description: artista.biografia || 'Sin biografía',
            contact: artista.telefono || 'No disponible',
            email: artista.correo || 'No disponible',
            image: artista.imagen 
              ? `http://localhost:5000/uploads/artista/${artista.imagen}` 
              : null,
            blockStatus: artista.blockStatus || {
              isBlocked: true,
              blockReason: 'Pendiente de aprobación por el administrador',
              blockedAt: new Date()
            }
          }));
        })
      );
    }
    
    obtenerNacionalidad(userId: string): Observable<string> {
      return this.http.get<any>(`${this.apiUrl}/nacionalidad/${userId}`).pipe(
        map(response => response.nacionalidad || 'No especificada')
      );
    }

    guardarArtista(artistaData: FormData): Observable<any> {
      const headers = this.getHeaders();
      return this.http.post<any>(`${this.apiUrl}/crear-artista`, artistaData, { 
        headers 
      }).pipe(
        map(response => {
          if (response.artista) {
            this.artistaDataSubject.next(response.artista);
          }
          return response;
        })
      );
    }

    getArtistInfo(): Observable<any> {
      return this.obtenerArtista();
    }

    obtenerArtistaPorId(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/artista/${id}`);
    }

    updateArtistaData(artista: any) {
      this.artistaDataSubject.next(artista);
    }
  }