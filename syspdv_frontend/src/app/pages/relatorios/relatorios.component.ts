import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VendaService } from '../../core/services/venda.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ApiUser, Venda } from '../../core/models/user.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    PanelModule,
    TooltipModule
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent implements OnInit {
  private vendaService = inject(VendaService);
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);

  vendas: Venda[] = [];
  usuarios: ApiUser[] = [];

  filtroDataInicio: Date | null = null;
  filtroDataFim: Date | null = null;
  filtroUsuarioId: number | null = null;
  filtroValorMin: number | null = null;
  filtroValorMax: number | null = null;

  totalVendasValor: number = 0;
  totalVendasCount: number = 0;
  totalItensVendidos: number = 0;

  dialogVisivel = false;
  vendaSelecionada: Venda | null = null;
  window: any;

  ngOnInit(): void {
    this.carregarVendas();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
    });
  }

  carregarVendas(): void {
    const filtros: any = {};
    if (this.filtroDataInicio) filtros.dataInicio = this.filtroDataInicio.toISOString();
    if (this.filtroDataFim) filtros.dataFim = this.filtroDataFim.toISOString();
    if (this.filtroUsuarioId) filtros.usuarioId = this.filtroUsuarioId;

    this.vendaService.listarVendas(filtros).subscribe({
      next: (data) => {
        let dadosFiltrados = data;
        if (this.filtroValorMin) {
          dadosFiltrados = dadosFiltrados.filter(v => v.valorTotal >= this.filtroValorMin!);
        }
        if (this.filtroValorMax) {
          dadosFiltrados = dadosFiltrados.filter(v => v.valorTotal <= this.filtroValorMax!);
        }

        this.vendas = dadosFiltrados;
        this.calcularSomatorios();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar relatórios.' });
      }
    });
  }

  limparFiltros(): void {
    this.filtroDataInicio = null;
    this.filtroDataFim = null;
    this.filtroUsuarioId = null;
    this.filtroValorMin = null;
    this.filtroValorMax = null;
    this.carregarVendas();
  }

  private calcularSomatorios(): void {
    this.totalVendasCount = this.vendas.length;
    this.totalVendasValor = this.vendas.reduce((acc, v) => acc + v.valorTotal, 0);
    this.totalItensVendidos = this.vendas.reduce((acc, v) =>
      acc + v.itens.reduce((itemAcc, item) => itemAcc + item.quantidade, 0), 0);
  }

  verDetalhes(venda: Venda): void {
    this.vendaSelecionada = venda;
    this.dialogVisivel = true;
  }
}
