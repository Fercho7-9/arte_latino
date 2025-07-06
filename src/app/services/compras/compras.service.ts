import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'http://localhost:5000/api/compras';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  realizarCompra(obras: any[], metodo_pago: any): Observable<any> {
    const obras_ids = obras.map(obra => obra._id);
    return this.http.post(`${this.apiUrl}/realizar`, { obras_ids, metodo_pago }, {
      headers: this.getHeaders()
    });
  }

  obtenerMisCompras(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-compras`, {
      headers: this.getHeaders()
    });
  }
}