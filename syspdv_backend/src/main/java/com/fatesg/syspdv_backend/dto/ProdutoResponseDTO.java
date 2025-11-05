package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "DTO para resposta de operações com produtos")
public class ProdutoResponseDTO {
    
    @Schema(description = "ID único do produto", example = "1")
    private Long id;
    
    @Schema(description = "Código único do produto", example = "PROD001")
    private String codigo;
    
    @Schema(description = "Nome do produto", example = "Notebook Dell Inspiron")
    private String nome;
    
    @Schema(description = "Categoria do produto", example = "Informática")
    private String categoria;
    
    @Schema(description = "Quantidade em estoque", example = "50.0")
    private BigDecimal quantidadeEstoque;
    
    @Schema(description = "Preço unitário do produto", example = "1999.99")
    private BigDecimal precoUnitario;
    
    public ProdutoResponseDTO() {}
    
    public ProdutoResponseDTO(Long id, String codigo, String nome, String categoria, BigDecimal quantidadeEstoque, BigDecimal precoUnitario) {
        this.id = id;
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