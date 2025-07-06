import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface UserResponse {
  message: string;
  user: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    nacionalidad?: string;
    imagen?: string;
    rol?: string;
    blockStatus?: {
      isBlocked: boolean;
      blockReason: string;
      blockedAt: Date | null;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.getHeaders() }).pipe(
      map(users => users.map(user => ({
        ...user,
        imagen: user.imagen || '',
        nacionalidad: user.nacionalidad || '',
        blockStatus: user.blockStatus || {
          isBlocked: false,
          blockReason: '',
          blockedAt: null
        }
      }))),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Error al obtener los usuarios'));
      })
    );
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return {
        ...user,
        nacionalidad: user.nacionalidad || '',
        imagen: user.imagen || ''
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() }).pipe(
      map(user => ({
        ...user,
        imagen: user.imagen || '',
        nacionalidad: user.nacionalidad || '',
        blockStatus: user.blockStatus || {
          isBlocked: false,
          blockReason: '',
          blockedAt: null
        }
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Error al obtener el usuario'));
      })
    );
  }

  updateUserProfile(userId: string, formData: FormData): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/${userId}`, formData, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => {
        if (response.user) {
          const updatedUser = {
            ...response.user,
            imagen: response.user.imagen || '',
            nacionalidad: response.user.nacionalidad || ''
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating profile:', error);
        return throwError(() => new Error('Error al actualizar el perfil'));
      })
    );
  }
}