export type UserRole = 'ADMIN' | 'OPERADOR';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}
