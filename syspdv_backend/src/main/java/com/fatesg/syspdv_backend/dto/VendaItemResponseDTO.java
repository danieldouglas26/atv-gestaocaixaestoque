package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "DTO para resposta de item de venda")
public class VendaItemResponseDTO {
    
    @Schema(description = "ID do item", example = "1")
    private Long id;
    
    @Schema(description = "Produto do item")
    private ProdutoResponseDTO produto;
    
    @Schema(description = "Quantidade vendida", example = "29.9999")
    private BigDecimal quantidade;
    
    @Schema(description = "Preço unitário no momento da venda", example = "299.99")
    private BigDecimal precoUnitario;
    
    @Schema(description = "Subtotal do item (quantidade × preço unitário)", example = "599.98")
    private BigDecimal subtotal;
    
    public VendaItemResponseDTO() {}
    
    public VendaItemResponseDTO(Long id, ProdutoResponseDTO produto, BigDecimal quantidade, 
                               BigDecimal precoUnitario, BigDecimal subtotal) {
        this.id = id;
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.subtotal = subtotal;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public ProdutoResponseDTO getProduto() { return produto; }
    public void setProduto(ProdutoResponseDTO produto) { this.produto = produto; }
    
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}