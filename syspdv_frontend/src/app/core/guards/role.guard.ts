import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pega as roles permitidas da definição da rota
  const allowedRoles = route.data['roles'] as UserRole[];

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // Role não permitida. Redireciona para a home (ou uma página de "acesso negado")
  // Vamos redirecionar para a rota principal, que fará o redirecionamento correto.
  router.navigate(['/app']);
  return false;
};
