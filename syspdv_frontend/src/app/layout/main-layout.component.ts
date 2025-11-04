import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User, UserRole } from '../core/models/user.model';
import { MenuItem } from 'primeng/api';


import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  sidebarVisible = true;
  menuItems: MenuItem[] = [];
  currentUser: User | null = this.authService.currentUser();

  ngOnInit(): void {
    this.buildMenu();
    this.handleInitialRedirect();
  }


  private handleInitialRedirect(): void {

    if (this.router.url === '/app' || this.router.url === '/app/') {
      const role = this.currentUser?.perfil;
      if (role === 'ADMIN') {
        this.router.navigate(['/app/dashboard']);
      } else if (role === 'OPERADOR') {
        this.router.navigate(['/app/welcome']);
      }
    }
  }


  private buildMenu(): void {
    const role = this.currentUser?.perfil;
    let items: MenuItem[] = [];


    if (role === 'ADMIN') {
      items = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/app/dashboard' },
        { label: 'Manter Usuários', icon: 'pi pi-fw pi-users', routerLink: '/app/usuarios' },
        { label: 'Gestão de Estoque', icon: 'pi pi-fw pi-box', routerLink: '/app/estoque' },
        { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: '/app/relatorios' }
      ];
    }

    else if (role === 'OPERADOR') {
      items = [
        { label: 'Bem-vindo', icon: 'pi pi-fw pi-home', routerLink: '/app/welcome' },
        { label: 'Caixa / Vendas', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/app/caixa' },
        { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: '/app/relatorios' }
      ];
    }

    this.menuItems = items;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
