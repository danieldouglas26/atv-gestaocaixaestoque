package com.fatesg.syspdv_backend.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "DTO para criação e atualização de produtos")
public class ProdutoRequestDTO {
    
    @Schema(description = "Código único do produto", example = "PROD001")
    @NotBlank(message = "Código do produto é obrigatório")
    private String codigo;
    
    @Schema(description = "Nome do produto", example = "Notebook Dell Inspiron")
    @NotBlank(message = "Nome do produto é obrigatório")
    private String nome;
    
    @Schema(description = "Categoria do produto", example = "Informática")
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;
    
    @Schema(description = "Quantidade em estoque", example = "50")
    @NotNull(message = "Quantidade em estoque é obrigatória")
    private BigDecimal quantidadeEstoque;
    
    @Schema(description = "Preço unitário do produto", example = "1999.99")
    @NotNull(message = "Preço unitário é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço unitário deve ser maior que zero")
    private BigDecimal precoUnitario;
    
    public ProdutoRequestDTO() {}
    
    public ProdutoRequestDTO(String codigo, String nome, String categoria, BigDecimal quantidadeEstoque, BigDecimal precoUnitario) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.quantidadeEstoque = quantidadeEstoque;
        this.precoUnitario = precoUnitario;
    }
    
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