import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private authService = inject(AuthService);

  userName = this.authService.currentUser()?.nome || 'Colega';
  dataAtual = new Date();

  // Lista de frases para variar a cada dia/login
  frases = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Que o seu dia seja produtivo e cheio de conquistas!",
    "Um ótimo atendimento começa com um sorriso.",
    "Hoje é um dia perfeito para fazer o seu melhor.",
    "Foco, força e boas vendas!",
    "Grandes coisas estão por vir hoje."
  ];

  // Seleciona uma frase aleatória
  fraseDoDia = this.frases[Math.floor(Math.random() * this.frases.length)];
}
