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

  ajustarEstoque(id: number, quantidade: number, motivo: string): Observable<any> {
    const params = new HttpParams()
      .set('quantidade', quantidade.toString())
      .set('motivo', motivo);
    return this.http.post(`${this.baseUrl}/${id}/ajustar-estoque`, null, { params });
  }
}
