package com.fatesg.syspdv_backend.dto;

import com.fatesg.syspdv_backend.model.PerfilUsuario;
import com.fatesg.syspdv_backend.model.StatusUsuario;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para criação e atualização de usuários")
public class UsuarioRequestDTO {
    
    @Schema(description = "Nome completo do usuário", example = "João Silva")
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;
    
    @Schema(description = "E-mail do usuário", example = "joao.silva@empresa.com")
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ser válido")
    private String email;
    
    @Schema(description = "Senha do usuário (mínimo 8 caracteres, 1 letra maiúscula e 1 número)", 
             example = "Senha123", minLength = 8)
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;
    
    @Schema(description = "Perfil do usuário. Valores aceitos: 'ADM' ou 'ADMIN' para Administrador, 'OPE' ou 'OPERADOR' para Operador", 
             example = "ADM", allowableValues = {"ADM", "ADMIN", "OPE", "OPERADOR"})
    @NotBlank(message = "Perfil é obrigatório")
    private String perfil;
    
    @Schema(description = "Status do usuário. Valores aceitos: 'A' ou 'ATIVO' para Ativo, 'I' ou 'INATIVO' para Inativo", 
             example = "A", allowableValues = {"A", "ATIVO", "I", "INATIVO"})
    @NotBlank(message = "Status é obrigatório")
    private String status;
    
    public UsuarioRequestDTO() {}
    
    public UsuarioRequestDTO(String nomeCompleto, String email, String senha, String perfil, String status) {
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
        this.status = status;
    }
    
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public String getPerfil() { return perfil; }
    public void setPerfil(String perfil) { this.perfil = perfil; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public PerfilUsuario getPerfilAsEnum() {
        return PerfilUsuario.fromString(this.perfil);
    }
    
    public StatusUsuario getStatusAsEnum() {
        return StatusUsuario.fromString(this.status);
    }
}