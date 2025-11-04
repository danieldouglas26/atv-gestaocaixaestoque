import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User, UserRole } from '../models/user.model';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly USER_KEY = 'auth_user';
  private static readonly TOKEN_KEY = 'auth_token';


  public currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(
    private mockApi: MockApiService,
    private router: Router
  ) { }

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.mockApi.login(email, senha).pipe(
      tap(response => {

        this.saveToStorage(response.user, response.token);

        this.currentUser.set(response.user);
      })
    );
  }

  logout(): void {

    localStorage.removeItem(AuthService.USER_KEY);
    localStorage.removeItem(AuthService.TOKEN_KEY);

    this.currentUser.set(null);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.TOKEN_KEY);
  }

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }
    return allowedRoles.includes(user.perfil);
  }



  private saveToStorage(user: User, token: string): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(AuthService.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
