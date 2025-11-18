import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimentacaoEstoque, Produto, EstoqueMovimentoPayload } from '../models/user.model'; // Adicione MovimentacaoEstoque
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) { }

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

  ajustarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/ajustar-estoque`, payload);
  }

  reporEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/repor-estoque`, payload);
  }


  baixarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/baixar-estoque`, payload);
  }


  verificarEstoque(payload: EstoqueMovimentoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/verificar-estoque`, payload);
  }


  buscarHistorico(id: number): Observable<MovimentacaoEstoque[]> {
    return this.http.get<MovimentacaoEstoque[]>(`${this.baseUrl}/${id}/historico`);
  }
}

