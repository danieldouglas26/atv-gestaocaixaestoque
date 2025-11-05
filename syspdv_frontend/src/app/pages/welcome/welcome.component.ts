import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  template: `<h1>Bem-vindo(a), {{ userName }}!</h1><p>Selecione uma opção no menu ao lado.</p>`
})
export class WelcomeComponent {
  private authService = inject(AuthService);
  userName = this.authService.currentUser()?.nome || 'Usuário';
}
