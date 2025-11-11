package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

@Schema(description = "DTO para movimentação de estoque")
public class EstoqueMovimentacaoRequestDTO {
    
    @Schema(description = "ID do produto (opcional se código for informado)", example = "1")
    private Long produtoId;
    
    @Schema(description = "Código do produto (opcional se ID for informado)", example = "PROD001")
    private String codigo;
    
    @Schema(description = "Quantidade para movimentação", example = "10")
    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser maior que zero")
    private BigDecimal quantidade;
    
    @Schema(description = "Motivo da movimentação", example = "Venda realizada")
    private String motivo;
    
    public EstoqueMovimentacaoRequestDTO() {}
    
    public EstoqueMovimentacaoRequestDTO(Long produtoId, String codigo, BigDecimal quantidade, String motivo) {
        this.produtoId = produtoId;
        this.codigo = codigo;
        this.quantidade = quantidade;
        this.motivo = motivo;
    }
    
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    
    public boolean isValid() {
        return (produtoId != null || (codigo != null && !codigo.trim().isEmpty()));
    }
}