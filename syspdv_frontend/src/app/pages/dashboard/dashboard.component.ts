import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { VendaService } from '../../core/services/venda.service';
import { ProdutoService } from '../../core/services/produto.service';
import { Venda } from '../../core/models/user.model';
import { TooltipModule } from 'primeng/tooltip'; // Adicionei o Tooltip que estava no HTML

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    TableModule, 
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private vendaService = inject(VendaService);
  private produtoService = inject(ProdutoService);

  // Indicadores
  faturamentoHoje: number = 0;
  vendasHojeCount: number = 0;
  produtosBaixoEstoqueCount: number = 0;
  
  // Tabela
  ultimasVendas: Venda[] = [];

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    // 1. Carregar Vendas e Calcular Indicadores do Dia
    this.vendaService.listarVendas().subscribe({
      next: (vendas) => {
        const hoje = new Date();
        
        // Filtra vendas que aconteceram hoje
        const vendasDoDia = vendas.filter(v => {
            const dataVenda = new Date(v.dataHora);
            return dataVenda.getDate() === hoje.getDate() &&
                   dataVenda.getMonth() === hoje.getMonth() &&
                   dataVenda.getFullYear() === hoje.getFullYear();
        });

        // Soma o total
        this.faturamentoHoje = vendasDoDia.reduce((acc, v) => acc + v.valorTotal, 0);
        this.vendasHojeCount = vendasDoDia.length;

        // Pega as 5 últimas para a tabela (Ordena decrescente por data)
        this.ultimasVendas = [...vendas]
            .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
            .slice(0, 5);
      }
    });

    // 2. Carregar Produtos e Verificar Estoque Crítico
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        // Conta produtos com 5 ou menos unidades
        this.produtosBaixoEstoqueCount = produtos.filter(p => p.quantidadeEstoque <= 5).length;
      }
    });
  }
}