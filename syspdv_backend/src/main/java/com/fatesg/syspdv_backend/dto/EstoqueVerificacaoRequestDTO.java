package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

@Schema(description = "DTO para verificação de estoque")
public class EstoqueVerificacaoRequestDTO {
    
    @Schema(description = "ID do produto (opcional se código for informado)", example = "1")
    private Long produtoId;
    
    @Schema(description = "Código do produto (opcional se ID for informado)", example = "PROD001")
    private String codigo;
    
    @Schema(description = "Quantidade necessária", example = "5")
    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser maior que zero")
    private BigDecimal quantidade;
    
    public EstoqueVerificacaoRequestDTO() {}
    
    public EstoqueVerificacaoRequestDTO(Long produtoId, String codigo, BigDecimal quantidade) {
        this.produtoId = produtoId;
        this.codigo = codigo;
        this.quantidade = quantidade;
    }

    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    
    public boolean isValid() {
        return (produtoId != null || (codigo != null && !codigo.trim().isEmpty()));
    }
}