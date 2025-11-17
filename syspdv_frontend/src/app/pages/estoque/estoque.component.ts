import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProdutoService } from '../../core/services/produto.service';
import { EstoqueMovimentoPayload, Produto } from '../../core/models/user.model';
import { MovimentacaoEstoque } from '../../core/models/user.model';

// Imports de PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { InputTextarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TabViewModule } from 'primeng/tabview'; // <--- Importante para as abas
import { TagModule } from 'primeng/tag'; 

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
    InputTextarea,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
    TabViewModule,
    TagModule
  ],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  produtos: Produto[] = [];
  produtosOriginal: Produto[] = [];

  // --- BUSCA ---
  searchControl = new FormControl('');

// --- HISTÓRICO ---
  historicoDialogVisivel = false;
  historicoMovimentacoes: MovimentacaoEstoque[] = [];
  produtoSelecionadoHistorico: Produto | null = null;
  carregandoHistorico = false;

  // --- CRUD PRODUTO ---
  produtoForm: FormGroup;
  dialogVisivel = false;
  isEditMode = false;
  currentProdutoId: number | null = null;

  // --- MOVIMENTAÇÃO DE ESTOQUE ---
  ajusteDialogVisivel = false;
  currentProdutoAjuste: Produto | null = null;

  // Formulários separados para cada aba
  formRepor: FormGroup;
  formBaixar: FormGroup;
  formAjuste: FormGroup;

  // Helpers para o template
  get f() { return this.produtoForm.controls; }

  constructor() {
    // Form principal do Produto (CRUD)
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidadeEstoque: [null, [Validators.required, Validators.min(0)]]
    });

    // 1. Aba Repor (Aumentar Estoque)
    this.formRepor = this.fb.group({
      quantidade: [null, [Validators.required, Validators.min(1)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });

    // 2. Aba Baixar (Diminuir Estoque)
    this.formBaixar = this.fb.group({
      quantidade: [null, [Validators.required, Validators.min(1)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });

    // 3. Aba Ajuste (Definir Valor Final / Inventário)
    this.formAjuste = this.fb.group({
      estoqueFinal: [null, [Validators.required, Validators.min(0)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe(data => {
      this.produtos = data;
      this.produtosOriginal = [...data];
    });
  }

  // --- BUSCA ---

  buscarProduto(): void {
    const codigo = this.searchControl.value;
    if (!codigo || codigo.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Digite um código para buscar.' });
      return;
    }

    this.produtoService.buscarPorCodigo(codigo.trim()).subscribe({
      next: (produto) => {
        this.produtos = [produto];
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Produto ${produto.codigo} encontrado.` });
      },
      error: () => {
        this.produtos = [];
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Produto com código '${codigo}' não foi encontrado.` });
      }
    });
  }

  limparBusca(): void {
    this.searchControl.setValue('');
    this.produtos = [...this.produtosOriginal];
  }

  // --- CRUD ---

  abrirDialogNovo(): void {
    this.isEditMode = false;
    this.produtoForm.reset();
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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao salvar produto.' });
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
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir produto' });
        }
      });
    }
  }

  // --- MOVIMENTAÇÃO DE ESTOQUE (ABAS) ---

  abrirDialogAjuste(produto: Produto): void {
    this.currentProdutoAjuste = produto;
    
    // Reseta os formulários das abas
    this.formRepor.reset();
    this.formBaixar.reset();
    this.formAjuste.reset();

    // Pré-preenche o formulário de Ajuste com o valor atual para facilitar
    this.formAjuste.patchValue({ estoqueFinal: produto.quantidadeEstoque });

    this.ajusteDialogVisivel = true;
  }


// --- NOVO MÉTODO: Abrir Histórico ---
  abrirHistorico(produto: Produto): void {
    this.produtoSelecionadoHistorico = produto;
    this.historicoDialogVisivel = true;
    this.carregandoHistorico = true;
    this.historicoMovimentacoes = []; // Limpa anterior

    this.produtoService.buscarHistorico(produto.id).subscribe({
      next: (data) => {
        this.historicoMovimentacoes = data;
        this.carregandoHistorico = false;
      },
      error: (err) => {
        this.carregandoHistorico = false;
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Não foi possível carregar o histórico.' 
        });
      }
    });
  }

  // Helper para cor da Badge/Tag
  getSeverity(tipo: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (tipo) {
      case 'ENTRADA': return 'success'; // Verde
      case 'SAIDA': return 'danger';    // Vermelho
      case 'AJUSTE': return 'warning';  // Laranja
      default: return 'info';
    }
  }


  fecharDialogAjuste(): void {
    this.ajusteDialogVisivel = false;
    this.currentProdutoAjuste = null;
  }

  // 1. Ação: REPOR (API espera quantidade positiva)
  onRepor(): void {
    if (this.formRepor.invalid || !this.currentProdutoAjuste) {
      this.formRepor.markAllAsTouched();
      return;
    }
    const { quantidade, motivo } = this.formRepor.value;

    const payload: EstoqueMovimentoPayload = {
      produtoId: this.currentProdutoAjuste.id,
      codigo: this.currentProdutoAjuste.codigo,
      quantidade: quantidade,
      motivo: motivo
    };

    this.produtoService.reporEstoque(payload).subscribe({
      next: () => this.handleSucessoMovimentacao('Estoque reposto com sucesso!'),
      error: (err) => this.handleErroMovimentacao(err)
    });
  }

  // 2. Ação: BAIXAR (API espera quantidade positiva que será subtraída)
  onBaixar(): void {
    if (this.formBaixar.invalid || !this.currentProdutoAjuste) {
      this.formBaixar.markAllAsTouched();
      return;
    }
    const { quantidade, motivo } = this.formBaixar.value;

    const payload: EstoqueMovimentoPayload = {
      produtoId: this.currentProdutoAjuste.id,
      codigo: this.currentProdutoAjuste.codigo,
      quantidade: quantidade,
      motivo: motivo
    };

    this.produtoService.baixarEstoque(payload).subscribe({
      next: () => this.handleSucessoMovimentacao('Baixa de estoque realizada!'),
      error: (err) => this.handleErroMovimentacao(err)
    });
  }

  // 3. Ação: AJUSTAR (API espera a diferença: Valor Final - Valor Atual)
  onAjustar(): void {
    if (this.formAjuste.invalid || !this.currentProdutoAjuste) {
      this.formAjuste.markAllAsTouched();
      return;
    }
    const { estoqueFinal, motivo } = this.formAjuste.value;
    
    // Cálculo da diferença
    const diferenca = estoqueFinal - this.currentProdutoAjuste.quantidadeEstoque;

    if (diferenca === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sem alterações', detail: 'O estoque final é igual ao atual.' });
      return;
    }

    const payload: EstoqueMovimentoPayload = {
      produtoId: this.currentProdutoAjuste.id,
      codigo: this.currentProdutoAjuste.codigo,
      quantidade: diferenca, // Envia a diferença (pode ser negativa ou positiva)
      motivo: motivo
    };

    this.produtoService.ajustarEstoque(payload).subscribe({
      next: () => this.handleSucessoMovimentacao('Inventário ajustado com sucesso!'),
      error: (err) => this.handleErroMovimentacao(err)
    });
  }

  private handleSucessoMovimentacao(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
    this.carregarProdutos();
    this.fecharDialogAjuste();
  }

  private handleErroMovimentacao(err: any): void {
    this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: err.error?.message || 'Erro ao processar movimentação.' 
    });
  }



  
}