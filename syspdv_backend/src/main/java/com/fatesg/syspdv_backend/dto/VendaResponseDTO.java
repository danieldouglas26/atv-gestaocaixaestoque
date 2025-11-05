package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "DTO para resposta de venda")
public class VendaResponseDTO {
    
    @Schema(description = "ID da venda", example = "1")
    private Long id;
    
    @Schema(description = "Data e hora da venda", example = "2024-01-15T10:30:00")
    private LocalDateTime dataHora;
    
    @Schema(description = "Valor total da venda", example = "599.98")
    private BigDecimal valorTotal;
    
    @Schema(description = "Valor recebido do cliente", example = "600.00")
    private BigDecimal valorRecebido;
    
    @Schema(description = "Troco para o cliente", example = "0.02")
    private BigDecimal troco;
    
    @Schema(description = "Usuário que realizou a venda")
    private UsuarioResponseDTO usuario;
    
    @Schema(description = "Itens da venda")
    private List<VendaItemResponseDTO> itens;
    
    public VendaResponseDTO() {}
    
    public VendaResponseDTO(Long id, LocalDateTime dataHora, BigDecimal valorTotal, 
                           BigDecimal valorRecebido, BigDecimal troco, UsuarioResponseDTO usuario, 
                           List<VendaItemResponseDTO> itens) {
        this.id = id;
        this.dataHora = dataHora;
        this.valorTotal = valorTotal;
        this.valorRecebido = valorRecebido;
        this.troco = troco;
        this.usuario = usuario;
        this.itens = itens;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    
    public BigDecimal getValorRecebido() { return valorRecebido; }
    public void setValorRecebido(BigDecimal valorRecebido) { this.valorRecebido = valorRecebido; }
    
    public BigDecimal getTroco() { return troco; }
    public void setTroco(BigDecimal troco) { this.troco = troco; }
    
    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }
    
    public List<VendaItemResponseDTO> getItens() { return itens; }
    public void setItens(List<VendaItemResponseDTO> itens) { this.itens = itens; }
}