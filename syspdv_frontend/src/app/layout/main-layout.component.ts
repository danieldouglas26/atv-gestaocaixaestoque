import { Component, OnInit, inject, effect } from '@angular/core'; // Importe 'effect'
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

  // Cria um "computed" simples apenas acessando o signal para uso no template
  currentUser = this.authService.currentUser;

  constructor() {
    // O 'effect' monitora mudanças no usuário automaticamente
    effect(() => {
      const user = this.authService.currentUser();
      console.log('Layout: Usuário detectado:', user); // <--- Veja isso no Console (F12)

      if (user) {
        this.buildMenu(user);
      } else {
        this.menuItems = [];
      }
    });
  }

  ngOnInit(): void {
    // Redirecionamento inicial se necessário
    if (this.router.url === '/app' || this.router.url === '/app/') {
      const user = this.authService.currentUser();
      if (user?.perfil === 'ADMIN') {
        this.router.navigate(['/app/dashboard']);
      } else if (user?.perfil === 'OPERADOR') {
        this.router.navigate(['/app/welcome']);
      }
    }
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
    } else {
      console.warn('Layout: Perfil desconhecido:', role); // <--- Aviso se o perfil estiver errado
    }

    this.menuItems = items;
  }

  onLogout(): void {
    this.authService.logout();
  }

  // Método auxiliar para o título (que estava faltando e gerando erro)
  getPageTitle(): string {
    // Lógica simples para pegar o título baseado na rota
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('usuarios')) return 'Usuários';
    if (url.includes('estoque')) return 'Estoque';
    if (url.includes('caixa')) return 'Caixa (PDV)';
    if (url.includes('relatorios')) return 'Relatórios';
    return 'SysPDV';
  }
}
