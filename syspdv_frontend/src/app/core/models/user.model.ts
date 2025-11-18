
export type UserRole = 'ADMIN' | 'OPERADOR';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: UserRole;
}

export interface ApiAuthResponse {
  sucesso: boolean;
  mensagem: string;
  usuario: ApiUser;
  tokenSessao: string;
}

export interface ApiUser {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: string;
  perfilDescricao: string;
  status: string;
  statusDescricao: string;
}

export interface UserPayload {
  nomeCompleto: string;
  email: string;
  senha?: string;
  perfil: string;
  status: string;
}


export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
}




export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}


export interface Venda {
  id: number;
  dataHora: string;
  valorTotal: number;
  valorRecebido: number;
  troco: number;
  usuario: ApiUser;
  itens: ItemVenda[];
}




export interface ItemVendaPayload {
  produtoId: number;
  quantidade: number;
}


export interface VendaPayload {
  itens: ItemVendaPayload[];
  valorRecebido: number;
  usuarioId: number;
}

export interface ItemVendaPayload {
  produtoId: number;
  quantidade: number;
}

export interface VendaPayload {
  itens: ItemVendaPayload[];
  valorRecebido: number;
  usuarioId: number;
}


export interface EstoqueMovimentoPayload {
  produtoId: number;
  quantidade: number;
  motivo?: string;
  codigo?: string;
}

export interface MovimentacaoEstoque {
  id: number;
  dataHora: string | Date;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  motivo: string;
  usuarioNome?: string;
}
