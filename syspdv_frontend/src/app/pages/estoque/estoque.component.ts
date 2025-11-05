import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProdutoService } from '../../core/services/produto.service';
import { Produto } from '../../core/models/user.model';

// Imports de PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { InputTextarea } from 'primeng/inputtextarea'; // <-- CORRIGIDO (era InputTextareaModule)
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    InputTextarea, // <-- CORRIGIDO (era InputTextareaModule)
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  produtos: Produto[] = [];
  produtosOriginal: Produto[] = []; // Guarda a lista completa

  // --- LÓGICA DE BUSCA ---
  searchControl = new FormControl('');

  // Formulário de CRUD (Novo/Editar)
  produtoForm: FormGroup;
  dialogVisivel = false;
  isEditMode = false;
  currentProdutoId: number | null = null;

  // Formulário de Ajuste de Estoque
  ajusteDialogVisivel = false;
  ajusteForm: FormGroup;
  currentProdutoAjuste: Produto | null = null;

  // Helper getter para validação do formulário de produto
  get f() { return this.produtoForm.controls; }
  // Helper getter para validação do formulário de ajuste
  get af() { return this.ajusteForm.controls; }

  constructor() {
    // Form de CRUD (com validações mais estritas)
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidadeEstoque: [null, [Validators.required, Validators.min(0)]]
    });

    // Form de Ajuste (com validação para não-zero)
    this.ajusteForm = this.fb.group({
      quantidade: [null, [Validators.required, Validators.pattern(/^-?[1-9]\d*$/), Validators.min(-9999), Validators.max(9999)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe(data => {
      this.produtos = data;
      this.produtosOriginal = [...data]; // Salva a lista original
    });
  }

  // --- LÓGICA DE BUSCA ---

  buscarProduto(): void {
    const codigo = this.searchControl.value;
    if (!codigo || codigo.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Digite um código para buscar.' });
      return;
    }

    this.produtoService.buscarPorCodigo(codigo.trim()).subscribe({
      next: (produto) => {
        this.produtos = [produto]; // Exibe apenas o produto encontrado
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Produto ${produto.codigo} encontrado.` });
      },
      error: (err) => {
        this.produtos = []; // Limpa a tabela se não encontrar
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Produto com código '${codigo}' não foi encontrado.` });
      }
    });
  }

  limparBusca(): void {
    this.searchControl.setValue('');
    this.produtos = [...this.produtosOriginal]; // Restaura a lista completa
  }


  // --- Métodos de CRUD (Já implementados) ---

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.produtoForm.reset(); // Limpa todos os campos
    this.dialogVisivel = true;
  }

  abrirDialogEditar(produto: Produto): void {
    this.isEditMode = true;
    this.currentProdutoId = produto.id;
    this.produtoForm.patchValue(produto); // Preenche o formulário
    this.dialogVisivel = true;
  }

  fecharDialog(): void {
    this.dialogVisivel = false;
    this.currentProdutoId = null;
  }

  salvarProduto(): void {
    if (this.produtoForm.invalid) {
      // Marca todos os campos como "tocados" para exibir os erros
      this.produtoForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    const payload: Omit<Produto, 'id'> = this.produtoForm.value;
    const operacao = this.isEditMode
      ? this.produtoService.atualizar(this.currentProdutoId!, payload)
      : this.produtoService.criar(payload);

    operacao.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!` });
        this.carregarProdutos();
        this.fecharDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao salvar produto. Verifique se o código já existe.' });
      }
    });
  }

  excluirProduto(id: number): void {
    // RECOMENDAÇÃO: Usar p-confirmDialog aqui no futuro
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluir(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído com sucesso!' });
          this.carregarProdutos();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir produto' });
        }
      });
    }
  }

  // --- MÉTODOS DE AJUSTE DE ESTOQUE (Já implementados) ---

  abrirDialogAjuste(produto: Produto): void {
    this.currentProdutoAjuste = produto;
    this.ajusteForm.reset(); // Limpa o formulário de ajuste
    this.ajusteDialogVisivel = true;
  }

  fecharDialogAjuste(): void {
    this.ajusteDialogVisivel = false;
    this.currentProdutoAjuste = null;
  }

  salvarAjuste(): void {
    if (this.ajusteForm.invalid || !this.currentProdutoAjuste) {
      this.ajusteForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Quantidade (diferente de zero) e Motivo (mín. 5 chars) são obrigatórios.' });
      return;
    }

    const { quantidade, motivo } = this.ajusteForm.value;
    this.produtoService.ajustarEstoque(this.currentProdutoAjuste.id, quantidade, motivo).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estoque ajustado com sucesso!' });
        this.carregarProdutos();
        this.fecharDialogAjuste();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao ajustar estoque. (Estoque insuficiente?)' });
      }
    });
  }
}
