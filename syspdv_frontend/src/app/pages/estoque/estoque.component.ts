import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    ToastModule
  ],
  templateUrl: './estoque.component.html', // Criaremos este arquivo
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  produtos: Produto[] = [];
  produtoForm: FormGroup;
  dialogVisivel = false;
  isEditMode = false;
  currentProdutoId: number | null = null;

  constructor() {
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      precoUnitario: [0, [Validators.required, Validators.min(0.01)]],
      quantidadeEstoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe(data => {
      this.produtos = data;
    });
  }

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.produtoForm.reset({ precoUnitario: 0, quantidadeEstoque: 0 });
    this.dialogVisivel = true;
  }

  abrirDialogEditar(produto: Produto): void {
    this.isEditMode = true;
    this.currentProdutoId = produto.id;
    this.produtoForm.patchValue(produto);
    this.dialogVisivel = true;
  }

  fecharDialog(): void {
    this.dialogVisivel = false;
    this.currentProdutoId = null;
  }

  salvarProduto(): void {
    if (this.produtoForm.invalid) {
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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao salvar produto' });
      }
    });
  }

  excluirProduto(id: number): void {
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
}
