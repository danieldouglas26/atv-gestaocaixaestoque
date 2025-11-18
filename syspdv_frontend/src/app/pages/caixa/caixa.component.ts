import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProdutoService } from '../../core/services/produto.service';
import { VendaService } from '../../core/services/venda.service';
import { AuthService } from '../../core/services/auth.service';
import { Produto, ItemVendaPayload, Venda, VendaPayload } from '../../core/models/user.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    ToastModule,
    TooltipModule,
    InputGroupModule,
    DialogModule
  ],
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.scss'
})
export class CaixaComponent {
  private produtoService = inject(ProdutoService);
  private vendaService = inject(VendaService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);


  buscaForm: FormGroup;
  pagamentoForm: FormGroup;


  carrinho = signal<ItemCarrinho[]>([]);
  produtoEncontrado = signal<Produto | null>(null);

  totalVenda = signal<number>(0);
  troco = signal<number>(0);


  reciboDialogVisivel = false;
  vendaFinalizada: Venda | null = null;

  constructor(private fb: FormBuilder) {
    this.buscaForm = this.fb.group({
      codigo: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });

    this.pagamentoForm = this.fb.group({
      valorRecebido: [null, [Validators.required, Validators.min(0)]]
    });
  }



  buscarProdutoPorCodigo(): void {
    const codigo = this.buscaForm.get('codigo')?.value;
    if (!codigo) return;

    this.produtoService.buscarPorCodigo(codigo).subscribe({
      next: (produto) => {
        this.produtoEncontrado.set(produto);

        document.getElementById('quantidadeBusca')?.focus();
      },
      error: () => {
        this.produtoEncontrado.set(null);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Produto não encontrado.' });
        this.buscaForm.get('codigo')?.setValue('');
      }
    });
  }

  adicionarAoCarrinho(): void {
    const produto = this.produtoEncontrado();
    const quantidade = this.buscaForm.get('quantidade')?.value;

    if (!produto || !quantidade || quantidade <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Busque um produto e informe a quantidade.' });
      return;
    }
    if (quantidade > produto.quantidadeEstoque) {
      this.messageService.add({ severity: 'error', detail: 'Quantidade excede o estoque disponível!' });
      return;
    }

    const itemExistente = this.carrinho().find(item => item.produto.id === produto.id);

    if (itemExistente) {

      this.carrinho.update(carrinhoAtual =>
        carrinhoAtual.map(item =>
          item.produto.id === produto.id
            ? {
              ...item,
              quantidade: item.quantidade + quantidade,
              subtotal: (item.quantidade + quantidade) * item.produto.precoUnitario
            }
            : item
        )
      );
    } else {

      const novoItem: ItemCarrinho = {
        produto: produto,
        quantidade: quantidade,
        subtotal: quantidade * produto.precoUnitario
      };
      this.carrinho.update(carrinhoAtual => [...carrinhoAtual, novoItem]);
    }

    this.atualizarTotal();
    this.limparBusca();
  }

  removerDoCarrinho(produtoId: number): void {
    this.carrinho.update(carrinhoAtual =>
      carrinhoAtual.filter(item => item.produto.id !== produtoId)
    );
    this.atualizarTotal();
  }



  private atualizarTotal(): void {
    const total = this.carrinho().reduce((acc, item) => acc + item.subtotal, 0);
    this.totalVenda.set(total);

    if (total > 0) {
      this.pagamentoForm.get('valorRecebido')?.setValue(total);
      this.calcularTroco();
    }
  }

  calcularTroco(): void {
    const valorRecebido = this.pagamentoForm.get('valorRecebido')?.value || 0;
    const total = this.totalVenda();
    const trocoCalculado = valorRecebido - total;
    this.troco.set(trocoCalculado < 0 ? 0 : trocoCalculado);
  }

  finalizarVenda(): void {
    if (this.carrinho().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Adicione produtos ao carrinho.' });
      return;
    }

    const valorRecebido = this.pagamentoForm.get('valorRecebido')?.value;
    if (valorRecebido < this.totalVenda()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Valor recebido é menor que o total.' });
      return;
    }

    const usuarioId = this.authService.currentUser()?.id;
    if (!usuarioId) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Sessão expirada. Faça login novamente.' });
      return;
    }


    const itensPayload: ItemVendaPayload[] = this.carrinho().map(item => ({
      produtoId: item.produto.id,
      quantidade: item.quantidade
    }));

    const vendaPayload: VendaPayload = {
      itens: itensPayload,
      valorRecebido: valorRecebido,
      usuarioId: usuarioId
    };


    this.vendaService.registrarVenda(vendaPayload).subscribe({
      next: (vendaRegistrada) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda registrada com sucesso!' });
        this.vendaFinalizada = vendaRegistrada;
        this.reciboDialogVisivel = true;
        this.limparVenda();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro ao registrar venda. Verifique o estoque.' });
      }
    });
  }

  limparVenda(): void {
    this.carrinho.set([]);
    this.produtoEncontrado.set(null);
    this.totalVenda.set(0);
    this.troco.set(0);
    this.buscaForm.reset({ quantidade: 1 });
    this.pagamentoForm.reset();
  }

  fecharRecibo(): void {
    this.reciboDialogVisivel = false;
    this.vendaFinalizada = null;
  }

  private limparBusca(): void {
    this.produtoEncontrado.set(null);
    this.buscaForm.reset({ quantidade: 1 });
    document.getElementById('codigoBusca')?.focus();
  }
}
