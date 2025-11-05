package com.fatesg.syspdv_backend.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "DTO para item de venda")
public class VendaItemRequestDTO {
    
    @Schema(description = "ID do produto", example = "1")
    @NotNull(message = "ID do produto é obrigatório")
    private Long produtoId;
    
    @Schema(description = "Quantidade do produto", example = "2")
    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser maior que zero")
    private BigDecimal quantidade;
    
    public VendaItemRequestDTO() {}
    
    public VendaItemRequestDTO(Long produtoId, BigDecimal quantidade) {
        this.produtoId = produtoId;
        this.quantidade = quantidade;
    }
    
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
}