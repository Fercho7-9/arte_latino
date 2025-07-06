import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';
  private authUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getAllArtists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/artists`, { headers: this.getHeaders() });
  }

  blockUser(userId: string, reason: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/block-user/${userId}`,
      { reason },
      { headers: this.getHeaders() }
    );
  }

  unblockUser(userId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/unblock-user/${userId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/delete-user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  blockArtist(artistId: string, reason: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/block-artist/${artistId}`,
      { reason },
      { headers: this.getHeaders() }
    );
  }

  unblockArtist(artistId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/unblock-artist/${artistId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteArtist(artistId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/delete-artist/${artistId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Server error:', error);
        throw error;
      })
    );
  }

  getAdminActions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actions`, { headers: this.getHeaders() });
  }

  resetPassword(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/reset-password`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }
}