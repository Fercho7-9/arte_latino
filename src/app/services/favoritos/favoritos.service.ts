import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private apiUrl = 'http://localhost:5000/api/favoritos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  toggleFavorito(obra_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle`, { obra_id }, {
      headers: this.getHeaders()
    });
  }

  obtenerMisFavoritos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-favoritos`, {
      headers: this.getHeaders()
    });
  }
}