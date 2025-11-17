import { Component, OnInit, inject, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    MenuModule,
    TooltipModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  menuItems: MenuItem[] = [];
  currentUser = this.authService.currentUser;

  // Controle de visibilidade do menu
  sidebarVisible = true; 

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.buildMenu(user);
      } else {
        this.menuItems = [];
      }
    });
  }

  ngOnInit(): void {
    if (this.router.url === '/app' || this.router.url === '/app/') {
      const user = this.authService.currentUser();
      if (user?.perfil === 'ADMIN') {
        this.router.navigate(['/app/dashboard']);
      } else if (user?.perfil === 'OPERADOR') {
        this.router.navigate(['/app/welcome']);
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onLogout(): void {
    this.authService.logout();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('usuarios')) return 'Usuários';
    if (url.includes('estoque')) return 'Estoque';
    if (url.includes('caixa')) return 'Caixa (PDV)';
    if (url.includes('relatorios')) return 'Relatórios';
    return 'SysPDV';
  }

  private buildMenu(user: User): void {
    const role = user.perfil;
    let items: MenuItem[] = [];

    if (role === 'ADMIN') {
      items = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/app/dashboard' },
        { label: 'Manter Usuários', icon: 'pi pi-fw pi-users', routerLink: '/app/usuarios' },
        { label: 'Gestão de Estoque', icon: 'pi pi-fw pi-box', routerLink: '/app/estoque' },
        { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: '/app/relatorios' }
      ];
    } else if (role === 'OPERADOR') {
      items = [
        { label: 'Bem-vindo', icon: 'pi pi-fw pi-home', routerLink: '/app/welcome' },
        { label: 'Caixa / Vendas', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/app/caixa' },
        { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: '/app/relatorios' }
      ];
    }

    this.menuItems = items;
  }
}