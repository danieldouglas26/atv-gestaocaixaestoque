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

  {
    path: 'login',
    component: LoginComponent
  },


  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [roleGuard],
        data: { roles: ['OPERADOR'] }
      },


      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'estoque',
        component: EstoqueComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'caixa',
        component: CaixaComponent,
        canActivate: [roleGuard],
        data: { roles: ['OPERADOR'] }
      },
      {
        path: 'relatorios',
        component: RelatoriosComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERADOR'] }
      },



    ]
  },


  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app'
  },


  {
    path: '**',
    redirectTo: 'app'
  }
];
