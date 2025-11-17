import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstoqueMovimentoPayload, Produto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) { }

  // --- CRUD Básico (Mantido igual, pois a API não mudou nestes pontos) ---

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/codigo/${codigo}`);
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  atualizar(id: number, produto: Omit<Produto, 'id'>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // --- NOVOS ENDPOINTS (Movimentação de Estoque - ATUALIZADO) ---

  /**
   * Realiza ajuste de estoque (positivo ou negativo) com motivo.
   * Agora envia um JSON Body para /api/produtos/ajustar-estoque
   */
  ajustarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/ajustar-estoque`, payload);
  }

  /**
   * Realiza reposição de estoque (apenas positivo).
   * Agora envia um JSON Body para /api/produtos/repor-estoque
   */
  reporEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/repor-estoque`, payload);
  }

  /**
   * Realiza baixa de estoque (apenas positivo).
   * Agora envia um JSON Body para /api/produtos/baixar-estoque
   */
  baixarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/baixar-estoque`, payload);
  }

  /**
   * Verifica se a quantidade solicitada está disponível.
   * MUDOU DE GET PARA POST conforme documentação
   */
  verificarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/verificar-estoque`, payload);
  }
}