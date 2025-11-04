import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthResponse, User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  // Dados mockados (simulando o banco de dados)
  private mockUsers: any[] = [
    {
      id: 1,
      nome: 'Administrador do Sistema',
      email: 'admin@email.com',
      perfil: 'ADMIN',
      // Senha 'Admin123' criptografada (BCrypt) - Isso seria feito no backend
      // No mock, vamos apenas checar a senha em texto plano para simplificar.
      senhaPlana: 'Admin123'
    },
    {
      id: 2,
      nome: 'Operador de Caixa',
      email: 'operador@email.com',
      perfil: 'OPERADOR',
      senhaPlana: 'Operador123'
    }
  ];

  constructor() { }

  // Simula o POST /login
  login(email: string, senha: string): Observable<AuthResponse> {
    const userFound = this.mockUsers.find(u => u.email === email && u.senhaPlana === senha);

    if (userFound) {
      // Simula a resposta do backend [cite: 11]
      const user: User = {
        id: userFound.id,
        nome: userFound.nome,
        email: userFound.email,
        perfil: userFound.perfil
      };

      const response: AuthResponse = {
        user: user,
        token: `mock-jwt-token-for-user-${user.id}` // Token falso
      };

      // Simula latência de rede
      return of(response).pipe(delay(500));
    } else {
      // Simula erro 401
      return throwError(() => new Error('Credenciais inválidas')).pipe(delay(500));
    }
  }
}
