import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda, VendaPayload } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private baseUrl = 'http://localhost:8080/api/vendas';
  private http = inject(HttpClient);

  constructor() { }

  /**
   * POST /api/vendas
   * Registra uma nova venda no sistema.
   */
  registrarVenda(payload: VendaPayload): Observable<Venda> {
    return this.http.post<Venda>(this.baseUrl, payload);
  }

  /**
   * GET /api/vendas
   * Lista todas as vendas (para relatórios).
   * Filtros são opcionais e enviados como query params.
   */
  listarVendas(filtros?: { dataInicio?: string, dataFim?: string, usuarioId?: number }): Observable<Venda[]> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.dataInicio) {
        params = params.set('dataInicio', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        params = params.set('dataFim', filtros.dataFim);
      }
      if (filtros.usuarioId) {
        params = params.set('usuarioId', filtros.usuarioId.toString());
      }
    }
    return this.http.get<Venda[]>(this.baseUrl, { params });
  }

  /**
   * GET /api/vendas/{id}
   * Busca uma venda específica pelo ID.
   */
  buscarVendaPorId(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /api/vendas/usuario/{usuarioId}
   * Busca vendas de um usuário específico.
   */
  buscarVendasPorUsuario(usuarioId: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }
}
