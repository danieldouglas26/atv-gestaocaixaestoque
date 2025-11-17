import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="grid-dashboard">
      <div class="card flex justify-content-between align-items-center mb-0">
        <div>
          <span class="block text-500 font-medium mb-3">Vendas (Hoje)</span>
          <div class="text-900 font-bold text-3xl">R$ 1.250,00</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
          <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
        </div>
      </div>

      <div class="card flex justify-content-between align-items-center mb-0">
        <div>
          <span class="block text-500 font-medium mb-3">Lucro Estimado</span>
          <div class="text-900 font-bold text-3xl">R$ 450,00</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
          <i class="pi pi-money-bill text-green-500 text-xl"></i>
        </div>
      </div>

      <div class="card flex justify-content-between align-items-center mb-0">
        <div>
          <span class="block text-500 font-medium mb-3">Novos Clientes</span>
          <div class="text-900 font-bold text-3xl">24</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
          <i class="pi pi-users text-cyan-500 text-xl"></i>
        </div>
      </div>
    </div>

    <div class="card mt-3">
        <h3>Atividades Recentes</h3>
        <p>Gráfico ou tabela de últimas vendas viria aqui...</p>
    </div>
  `,
  styles: [`
    .grid-dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    /* Classes utilitárias inline para os ícones coloridos (simulando PrimeFlex sem instalar) */
    .bg-blue-100 { background-color: #dbeafe; }
    .text-blue-500 { color: #3b82f6; }
    .bg-green-100 { background-color: #dcfce7; }
    .text-green-500 { color: #22c55e; }
    .bg-cyan-100 { background-color: #cffafe; }
    .text-cyan-500 { color: #06b6d4; }
    .border-round { border-radius: 6px; }
  `]
})
export class DashboardComponent {}
