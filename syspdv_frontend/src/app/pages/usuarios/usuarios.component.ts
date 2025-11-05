import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'; // Adicione FormControl
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { ApiUser, UserPayload } from '../../core/models/user.model';

// Imports de PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup'; // <-- NOVO IMPORT
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'; // <-- NOVO IMPORT
import { InputNumberModule } from 'primeng/inputnumber'; // <-- NOVO IMPORT (para busca de ID)

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
    ToastModule,
    TooltipModule,
    InputGroupModule, // <-- NOVO IMPORT
    InputGroupAddonModule, // <-- NOVO IMPORT
    InputNumberModule // <-- NOVO IMPORT
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  usuarios: ApiUser[] = [];
  usuariosOriginal: ApiUser[] = []; // Guarda a lista completa

  // --- LÓGICA DE BUSCA ---
  searchIdControl = new FormControl<number | null>(null);

  // --- Formulários e Dialogs ---
  usuarioForm: FormGroup;
  dialogVisivel = false;
  isEditMode = false;
  currentUserId: number | null = null;

  // Opções para os dropdowns
  perfis = [
    { label: 'Administrador', value: 'ADM' },
    { label: 'Operador', value: 'OPE' }
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
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]]
    });
  }

  // Getter para facilitar o acesso aos controles do form no template
  get f() { return this.usuarioForm.controls; }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    // Implementa GET /api/usuarios
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
      this.usuariosOriginal = [...data]; // Salva a lista original
    });
  }

  // --- NOVAS FUNÇÕES DE BUSCA POR ID ---

  buscarUsuarioPorId(): void {
    const id = this.searchIdControl.value;
    if (!id || id <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Digite um ID válido para buscar.' });
      return;
    }

    // *** AQUI IMPLEMENTAMOS GET /api/usuarios/{id} ***
    this.usuarioService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuarios = [usuario]; // Exibe apenas o usuário encontrado
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ID ${id} encontrado.` });
      },
      error: (err) => {
        this.usuarios = []; // Limpa a tabela se não encontrar
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Usuário com ID '${id}' não foi encontrado.` });
      }
    });
  }

  limparBusca(): void {
    this.searchIdControl.setValue(null);
    this.usuarios = [...this.usuariosOriginal]; // Restaura a lista completa
  }

  // --- Métodos de CRUD (Já implementados) ---

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.usuarioForm.reset({ perfil: 'OPR', status: 'A' });
    this.usuarioForm.get('senha')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  abrirDialogEditar(usuario: ApiUser): void {
    this.isEditMode = true;
    this.currentUserId = usuario.id;
    this.usuarioForm.patchValue(usuario);
    this.usuarioForm.get('senha')?.clearValidators(); // Senha opcional na edição
    this.usuarioForm.get('senha')?.addValidators([
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.dialogVisivel = true;
  }

  fecharDialog(): void {
    this.dialogVisivel = false;
    this.currentUserId = null;
  }

  salvarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    const payload: UserPayload = this.usuarioForm.value;

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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao salvar usuário (E-mail já pode existir)' });
      }
    });
  }

  excluirUsuario(id: number): void {
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
