import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) { }

  // --- CRUD Básico (Já implementado) ---

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
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

  // --- NOVOS ENDPOINTS (Movimentação de Estoque) ---

  /**
   * Realiza ajuste de estoque (positivo ou negativo) com motivo.
   * (Usado pelo Admin na tela de Gestão de Estoque)
   */
  ajustarEstoque(id: number, quantidade: number, motivo: string): Observable<any> {
    const params = new HttpParams()
      .set('quantidade', quantidade.toString())
      .set('motivo', motivo);
    return this.http.post(`${this.baseUrl}/${id}/ajustar-estoque`, null, { params });
  }

  /**
   * Realiza reposição de estoque (apenas positivo).
   */
  reporEstoque(id: number, quantidade: number): Observable<any> {
    const params = new HttpParams().set('quantidade', quantidade.toString());
    return this.http.post(`${this.baseUrl}/${id}/repor-estoque`, null, { params });
  }

  /**
   * Realiza baixa de estoque (apenas positivo).
   * (Usado pela tela de Vendas/Caixa)
   */
  baixarEstoque(id: number, quantidade: number): Observable<any> {
    const params = new HttpParams().set('quantidade', quantidade.toString());
    return this.http.post(`${this.baseUrl}/${id}/baixar-estoque`, null, { params });
  }

  // --- NOVOS ENDPOINTS (Consulta) ---

  /**
   * Verifica se a quantidade solicitada está disponível.
   * (Usado pela tela de Vendas/Caixa)
   */
  verificarEstoque(id: number, quantidade: number): Observable<boolean> {
    const params = new HttpParams().set('quantidade', quantidade.toString());
    return this.http.get<boolean>(`${this.baseUrl}/${id}/verificar-estoque`, { params });
  }

  /**
   * Busca um produto pelo seu código.
   * (Usado pela tela de Vendas/Caixa)
   */
  buscarPorCodigo(codigo: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/codigo/${codigo}`);
  }
}
