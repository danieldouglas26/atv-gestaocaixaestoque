package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para resposta de operações com usuários")
public class UsuarioResponseDTO {
    
    @Schema(description = "ID único do usuário", example = "1")
    private Long id;
    
    @Schema(description = "Nome completo do usuário", example = "João Silva")
    private String nomeCompleto;
    
    @Schema(description = "E-mail do usuário", example = "joao.silva@empresa.com")
    private String email;
    
    @Schema(description = "Sigla do perfil do usuário", example = "ADM", allowableValues = {"ADM", "OPE"})
    private String perfil;
    
    @Schema(description = "Descrição do perfil do usuário", example = "Administrador")
    private String perfilDescricao;
    
    @Schema(description = "Sigla do status do usuário", example = "A", allowableValues = {"A", "I"})
    private String status;
    
    @Schema(description = "Descrição do status do usuário", example = "Ativo")
    private String statusDescricao;
    
    public UsuarioResponseDTO() {}
    
    public UsuarioResponseDTO(Long id, String nomeCompleto, String email, String perfil, 
                             String perfilDescricao, String status, String statusDescricao) {
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.perfil = perfil;
        this.perfilDescricao = perfilDescricao;
        this.status = status;
        this.statusDescricao = statusDescricao;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPerfil() { return perfil; }
    public void setPerfil(String perfil) { this.perfil = perfil; }
    
    public String getPerfilDescricao() { return perfilDescricao; }
    public void setPerfilDescricao(String perfilDescricao) { this.perfilDescricao = perfilDescricao; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getStatusDescricao() { return statusDescricao; }
    public void setStatusDescricao(String statusDescricao) { this.statusDescricao = statusDescricao; }
}