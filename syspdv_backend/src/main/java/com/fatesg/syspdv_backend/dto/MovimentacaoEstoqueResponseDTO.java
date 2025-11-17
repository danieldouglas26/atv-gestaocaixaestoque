package com.fatesg.syspdv_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para resposta de histórico de movimentação")
public class MovimentacaoEstoqueResponseDTO {

    @Schema(description = "ID da movimentação")
    private Long id;

    @Schema(description = "Data e hora da movimentação")
    private LocalDateTime dataHora;

    @Schema(description = "Tipo da movimentação (ENTRADA, SAIDA, INVENTARIO)")
    private String tipo;

    @Schema(description = "Quantidade movimentada")
    private BigDecimal quantidade;

    @Schema(description = "Motivo da movimentação")
    private String motivo;

    @Schema(description = "Nome do usuário que realizou a ação (Opcional)")
    private String usuarioNome;

    public MovimentacaoEstoqueResponseDTO(Long id, LocalDateTime dataHora, String tipo, BigDecimal quantidade, String motivo, String usuarioNome) {
        this.id = id;
        this.dataHora = dataHora;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.motivo = motivo;
        this.usuarioNome = usuarioNome;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getUsuarioNome() { return usuarioNome; }
    public void setUsuarioNome(String usuarioNome) { this.usuarioNome = usuarioNome; }
}