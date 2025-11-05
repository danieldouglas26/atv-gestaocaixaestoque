import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { CaixaComponent } from './pages/caixa/caixa.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';

export const routes: Routes = [
  // Rota de Login (pública)
  {
    path: 'login',
    component: LoginComponent
  },

  // Rota principal da aplicação (protegida por login)
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Telas iniciais baseadas em role
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] } //
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [roleGuard],
        data: { roles: ['OPERADOR'] } //
      },

      // Módulos
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] } // [cite: 6, 14]
      },
      {
        path: 'estoque',
        component: EstoqueComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] } // [cite: 6, 26]
      },
      {
        path: 'caixa',
        component: CaixaComponent,
        canActivate: [roleGuard],
        data: { roles: ['OPERADOR'] } // [cite: 6, 41]
      },
      {
        path: 'relatorios',
        component: RelatoriosComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERADOR'] } // [cite: 6, 52, 61]
      },

      // Rota 'vazia' dentro de /app, será tratada pelo MainLayoutComponent
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard' // O MainLayoutComponent irá corrigir se for Operador
      }
    ]
  },

  // Redirecionamento padrão para a aplicação (se já logado) ou login
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app'
  },

  // Rota Curinga (Not Found)
  {
    path: '**',
    redirectTo: 'app'
  }
];
