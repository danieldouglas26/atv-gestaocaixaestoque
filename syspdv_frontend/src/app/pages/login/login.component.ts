import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
// ... (imports de UI)
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // ... (propriedades fb, authService, etc. continuam iguais)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  isLoading = false;

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos.' });
      return;
    }

    this.isLoading = true;
    const { email, senha } = this.loginForm.value;

    this.authService.login(email!, senha!).subscribe({
      next: () => {
        // Sucesso, redireciona para a página principal
        this.router.navigate(['/app']);
        // O isLoading será resetado naturalmente pela navegação
      },
      error: (err: Error) => { // Agora recebemos um Error
        this.isLoading = false;
        // Mostra a mensagem de erro vinda do AuthService
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }
}
