// --- Modelos de Autenticação e Usuário (Já existem) ---
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

// --- Modelo de Produto (Já existe) ---
export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
}

// --- NOVOS MODELOS DE VENDA (Baseado na API) ---

// Modelo do Item da Venda (Resposta da API)
export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

// Modelo da Venda Completa (Resposta da API)
export interface Venda {
  id: number;
  dataHora: string; // ou Date, se preferir tratar na recepção
  valorTotal: number;
  valorRecebido: number;
  troco: number;
  usuario: ApiUser;
  itens: ItemVenda[];
}

// --- NOVOS MODELOS DE PAYLOAD (Envio para API) ---

// Modelo do Item para o Payload de nova Venda
export interface ItemVendaPayload {
  produtoId: number;
  quantidade: number;
}

// Modelo do Payload para registrar nova Venda
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

// [NOVO] Interface para movimentação de estoque (Ajuste, Baixa, Reposição)
export interface EstoqueMovimentoPayload {
  produtoId: number;
  quantidade: number;
  motivo?: string; // Opcional em alguns casos, obrigatório em outros
  codigo?: string; // A API lista, mas geralmente o ID basta (opcional)
}

export interface MovimentacaoEstoque {
  id: number;
  dataHora: string | Date;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE'; // Ou como sua API retornar
  quantidade: number;
  motivo: string;
  usuarioNome?: string; // Opcional: quem fez a alteração
}