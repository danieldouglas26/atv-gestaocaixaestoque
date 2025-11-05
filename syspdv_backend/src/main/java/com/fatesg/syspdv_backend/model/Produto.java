package com.fatesg.syspdv_backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "produtos")
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Código do produto é obrigatório")
    @Column(unique = true, nullable = false, length = 20)
    private String codigo;
    
    @NotBlank(message = "Nome do produto é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;
    
    @NotBlank(message = "Categoria é obrigatória")
    @Column(nullable = false, length = 100)
    private String categoria;
    
    @NotNull(message = "Quantidade em estoque é obrigatória")
    @DecimalMin(value = "0.0", inclusive = false, message = "Quantidade deve ser maior que zero")
    @Column(name = "quantidade_estoque", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantidadeEstoque;
    
    @NotNull(message = "Preço unitário é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço unitário deve ser maior que zero")
    @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;
    
    
    public Produto() {}
    
    public Produto(String codigo, String nome, String categoria, BigDecimal quantidadeEstoque, BigDecimal precoUnitario) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.quantidadeEstoque = quantidadeEstoque;
        this.precoUnitario = precoUnitario;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public BigDecimal getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(BigDecimal quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }
    
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
}