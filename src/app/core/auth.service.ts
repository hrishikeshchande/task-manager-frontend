import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus$ = new BehaviorSubject<boolean>(this.isTokenValid());

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: object) {
    return this.http
      .post<any>(`${environment.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response?.token);
          this.authStatus$.next(true);
        })
      );
  }

  logout() {
  return this.http
    .get<any>(`${environment.baseUrl}/auth/logout`)
    .pipe(
      tap({
        next: () => {
          localStorage.removeItem('token');
          this.authStatus$.next(false);
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem('token');
          this.authStatus$.next(false);
          this.router.navigate(['/login']);
        }
      })
    );
}


  isLoggedIn(): boolean {
    return this.authStatus$.value;
  }

  getAuthStatusObservable() {
    return this.authStatus$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('JWT Decode error', error);
      return null;
    }
  }

  getUserNameIdentifier(): string | null {
    return (
      this.getDecodedToken()?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ?? null
    );
  }
  getUserRole(): string | null {
    return (
      this.getDecodedToken()?.[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ?? null
    );
  }

  getUsername(): string | null {
    return (
      this.getDecodedToken()?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] ?? null
    );
  }

  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (err) {
      return false;
    }
  }
}
