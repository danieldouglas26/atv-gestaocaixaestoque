package com.fatesg.syspdv_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
public class MovimentacaoEstoque {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 1)
    private TipoMovimentacao tipo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;
    
    @Column(name = "quantidade", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidade;
    
    @Column(name = "estoque_anterior", nullable = false, precision = 10, scale = 3)
    private BigDecimal estoqueAnterior;
    
    @Column(name = "estoque_atual", nullable = false, precision = 10, scale = 3)
    private BigDecimal estoqueAtual;
    
    @Column(name = "motivo", nullable = false, length = 100)
    private String motivo;
    
    
    public MovimentacaoEstoque() {
        this.dataHora = LocalDateTime.now();
    }
    
    public MovimentacaoEstoque(TipoMovimentacao tipo, Produto produto, BigDecimal quantidade, 
                              BigDecimal estoqueAnterior, BigDecimal estoqueAtual, String motivo) {
        this();
        this.tipo = tipo;
        this.produto = produto;
        this.quantidade = quantidade;
        this.estoqueAnterior = estoqueAnterior;
        this.estoqueAtual = estoqueAtual;
        this.motivo = motivo;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    
    public TipoMovimentacao getTipo() { return tipo; }
    public void setTipo(TipoMovimentacao tipo) { this.tipo = tipo; }
    
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
    
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    
    public BigDecimal getEstoqueAnterior() { return estoqueAnterior; }
    public void setEstoqueAnterior(BigDecimal estoqueAnterior) { this.estoqueAnterior = estoqueAnterior; }
    
    public BigDecimal getEstoqueAtual() { return estoqueAtual; }
    public void setEstoqueAtual(BigDecimal estoqueAtual) { this.estoqueAtual = estoqueAtual; }
    
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    
}