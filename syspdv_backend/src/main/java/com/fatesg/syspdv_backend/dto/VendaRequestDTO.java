package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "DTO para criação de venda")
public class VendaRequestDTO {
    
    @Schema(description = "Itens da venda")
    @NotNull(message = "Itens da venda são obrigatórios")
    @Size(min = 1, message = "A venda deve ter pelo menos um item")
    private List<VendaItemRequestDTO> itens;
    
    @Schema(description = "Valor recebido do cliente", example = "200.00")
    @NotNull(message = "Valor recebido é obrigatório")
    @Positive(message = "Valor recebido deve ser maior que zero")
    private BigDecimal valorRecebido;
    
    @Schema(description = "ID do usuário operador", example = "2")
    @NotNull(message = "ID do usuário é obrigatório")
    private Long usuarioId;
    
    public VendaRequestDTO() {}
    
    public VendaRequestDTO(List<VendaItemRequestDTO> itens, BigDecimal valorRecebido, Long usuarioId) {
        this.itens = itens;
        this.valorRecebido = valorRecebido;
        this.usuarioId = usuarioId;
    }
    
    public List<VendaItemRequestDTO> getItens() { return itens; }
    public void setItens(List<VendaItemRequestDTO> itens) { this.itens = itens; }
    
    public BigDecimal getValorRecebido() { return valorRecebido; }
    public void setValorRecebido(BigDecimal valorRecebido) { this.valorRecebido = valorRecebido; }
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}