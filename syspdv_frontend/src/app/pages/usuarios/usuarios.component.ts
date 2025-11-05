import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { ApiUser, UserPayload } from '../../core/models/user.model';

// Imports de PrimeNG para o CRUD
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    PasswordModule,
    ToastModule
  ],
  templateUrl: './usuarios.component.html', // Criaremos este arquivo
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  usuarios: ApiUser[] = [];
  usuarioForm: FormGroup;
  dialogVisivel = false;
  isEditMode = false;
  currentUserId: number | null = null;

  // Opções para os dropdowns (baseado na API)
  perfis = [
    { label: 'Administrador', value: 'ADM' },
    { label: 'Operador', value: 'OPR' } // Assumindo 'OPR' para Operador
  ];
  status = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ];

  constructor() {
    this.usuarioForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['OPR', Validators.required],
      status: ['A', Validators.required],
      senha: ['', [Validators.minLength(8)]] // Senha opcional na edição
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
    });
  }

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.usuarioForm.reset({ perfil: 'OPR', status: 'A' });
    // Senha é obrigatória ao criar
    this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  abrirDialogEditar(usuario: ApiUser): void {
    this.isEditMode = true;
    this.currentUserId = usuario.id;
    this.usuarioForm.patchValue(usuario);
    // Senha é opcional ao editar
    this.usuarioForm.get('senha')?.clearValidators();
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  fecharDialog(): void {
    this.dialogVisivel = false;
    this.currentUserId = null;
  }

  salvarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    const payload: UserPayload = this.usuarioForm.value;

    // Remove a senha se estiver vazia (na edição)
    if (!payload.senha) {
      delete payload.senha;
    }

    const operacao = this.isEditMode
      ? this.usuarioService.atualizar(this.currentUserId!, payload)
      : this.usuarioService.criar(payload);

    operacao.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!` });
        this.carregarUsuarios();
        this.fecharDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao salvar usuário' });
      }
    });
  }

  excluirUsuario(id: number): void {
    // Adicionar um p-confirmDialog seria o ideal, mas por simplicidade:
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluir(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso!' });
          this.carregarUsuarios();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir usuário' });
        }
      });
    }
  }
}
