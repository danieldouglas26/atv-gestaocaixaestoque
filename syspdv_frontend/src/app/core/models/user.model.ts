// Modelo do Usuário no Sistema
export type UserRole = 'ADMIN' | 'OPERADOR';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: UserRole; // 'ADMIN' ou 'OPERADOR'
}

// Modelo da Resposta de Login
export interface ApiAuthResponse {
  sucesso: boolean;
  mensagem: string;
  usuario: ApiUser;
  tokenSessao: string;
}

// Modelo do Usuário
export interface ApiUser {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: string; // "ADM" ou "OPR"
  perfilDescricao: string;
  status: string;
  statusDescricao: string;
}

// Modelo para criação/atualização de usuário
export interface UserPayload {
  nomeCompleto: string;
  email: string;
  senha?: string; // Senha é opcional na atualização
  perfil: string; // "ADM" ou "OPR"
  status: string; // "A" ou "I"
}

// Modelo do Produto
export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
}
