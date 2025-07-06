import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private apiUrl = 'http://localhost:5000/api/obras';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Public endpoint - no authentication needed
  obtenerTodasLasObras(): Observable<any> {
    return this.http.get(`${this.apiUrl}/todas-publicas`);
  }

  // Keep other methods that require authentication
  createObra(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-obras`, formData, {
      headers: this.getHeaders()
    });
  }

  obtenerObraPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getObrasArtista(artistaId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artista/${artistaId}`, {
      headers: this.getHeaders()
    });
  }

  actualizarObra(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-obras/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  eliminarObra(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getObrasArtistaPublic(artistaId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/obras-publicas/artista/${artistaId}`);
  }

  rateObra(obraId: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/rate/${obraId}`, { rating }, {
      headers: this.getHeaders()
    });
  }

  toggleFavorite(obraId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-favorite/${obraId}`, {}, {
      headers: this.getHeaders()
    });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorites`, {
      headers: this.getHeaders()
    });
  }
}