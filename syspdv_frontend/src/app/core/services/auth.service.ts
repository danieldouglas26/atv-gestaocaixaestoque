import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { ApiAuthResponse, ApiUser, User, UserRole } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  private static readonly USER_KEY = 'auth_user';
  private static readonly TOKEN_KEY = 'auth_token';

  public currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private mapApiPerfilToUserRole(apiPerfil: string): UserRole {
    if (apiPerfil === 'ADM') {
      return 'ADMIN';
    }
    return 'OPERADOR';
  }

  login(email: string, senha: string): Observable<User> {
    const credenciais = { email, senha };

    return this.http.post<ApiAuthResponse>(`${this.baseUrl}/login`, credenciais).pipe(
      map(response => {
        if (!response.sucesso || !response.usuario || !response.tokenSessao) {
          throw new Error(response.mensagem || 'Resposta inválida do servidor');
        }

        // 1. Mapeia a resposta da API para o nosso modelo 'User' interno
        const apiUser: ApiUser = response.usuario;
        const user: User = {
          id: apiUser.id,
          nome: apiUser.nomeCompleto,
          email: apiUser.email,
          perfil: this.mapApiPerfilToUserRole(apiUser.perfil)
        };

        // 2. Salva no storage
        this.saveToStorage(user, response.tokenSessao);

        // 3. Atualiza o signal
        this.currentUser.set(user);

        return user;
      }),
      catchError(err => {
        // Pega a mensagem de erro do backend ou uma padrão
        const errorMessage = err.error?.mensagem || err.message || 'Credenciais inválidas';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    // Limpa o localStorage
    localStorage.removeItem(AuthService.USER_KEY);
    localStorage.removeItem(AuthService.TOKEN_KEY);

    // Limpa o signal
    this.currentUser.set(null);

    // Redireciona para o login
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

  // --- Métodos de Storage ---

  private saveToStorage(user: User, token: string): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(AuthService.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
