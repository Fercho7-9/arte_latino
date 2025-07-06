import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<any>(null);

  authState$ = this.authStateSubject.asObservable();
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private initializeAuthState() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    const isAuthenticated = !!token;
    this.authStateSubject.next(isAuthenticated);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        const processedUser = {
          ...userData,
          nacionalidad: userData.nacionalidad || '',
          imagen: userData.imagen || '',
          blockStatus: userData.blockStatus || {
            isBlocked: false,
            blockReason: '',
            blockedAt: null
          }
        };
        this.userDataSubject.next(processedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthState();
      }
    }
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          const processedUser = {
            ...response.user,
            nacionalidad: response.user.nacionalidad || '',
            imagen: response.user.imagen || '',
            blockStatus: response.user.blockStatus || {
              isBlocked: false,
              blockReason: '',
              blockedAt: null
            }
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(processedUser));
          this.authStateSubject.next(true);
          this.userDataSubject.next(processedUser);
        }
      })
    );
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          const processedUser = {
            ...response.user,
            nacionalidad: response.user.nacionalidad || '',
            imagen: response.user.imagen || '',
            blockStatus: response.user.blockStatus || {
              isBlocked: false,
              blockReason: '',
              blockedAt: null
            }
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(processedUser));
          this.authStateSubject.next(true);
          this.userDataSubject.next(processedUser);
        }
      })
    );
  }

  updateAuthState(isAuthenticated: boolean, userData?: any) {
    this.authStateSubject.next(isAuthenticated);
    if (userData) {
      const processedUser = {
        ...userData,
        nacionalidad: userData.nacionalidad || '',
        imagen: userData.imagen || '',
        blockStatus: userData.blockStatus || {
          isBlocked: false,
          blockReason: '',
          blockedAt: null
        }
      };
      this.userDataSubject.next(processedUser);
      localStorage.setItem('user', JSON.stringify(processedUser));
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authStateSubject.next(false);
    this.userDataSubject.next(null);
  }

  clearAuthState() {
    this.authStateSubject.next(false);
    this.userDataSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  resetPassword(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, password });
  }

  updateRole(userId: string, role: string) {
    return this.http.patch(`${this.apiUrl}/update-role`, { userId, role }, { headers: this.getHeaders() });
  }
}