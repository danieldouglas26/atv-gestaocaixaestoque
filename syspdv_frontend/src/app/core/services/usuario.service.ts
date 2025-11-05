import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUser, UserPayload } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  listar(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.baseUrl}/${id}`);
  }

  criar(usuario: UserPayload): Observable<ApiUser> {
    return this.http.post<ApiUser>(this.baseUrl, usuario);
  }

  atualizar(id: number, usuario: UserPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, usuario);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
