package com.fatesg.syspdv_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para resposta de login")
public class LoginResponseDTO {
    
    @Schema(description = "Indica se o login foi bem-sucedido", example = "true")
    private boolean sucesso;
    
    @Schema(description = "Mensagem descritiva do resultado", example = "Login realizado com sucesso")
    private String mensagem;
    
    @Schema(description = "Dados do usuário autenticado")
    private UsuarioResponseDTO usuario;
    
    @Schema(description = "Token de sessão (simples para projeto educacional)", example = "session_123456")
    private String tokenSessao;
    
    public LoginResponseDTO() {}
    
    public LoginResponseDTO(boolean sucesso, String mensagem, UsuarioResponseDTO usuario, String tokenSessao) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.usuario = usuario;
        this.tokenSessao = tokenSessao;
    }
    
    public static LoginResponseDTO sucesso(UsuarioResponseDTO usuario, String tokenSessao) {
        return new LoginResponseDTO(true, "Login realizado com sucesso", usuario, tokenSessao);
    }
    
    public static LoginResponseDTO falha(String mensagem) {
        return new LoginResponseDTO(false, mensagem, null, null);
    }
    
    public boolean isSucesso() { return sucesso; }
    public void setSucesso(boolean sucesso) { this.sucesso = sucesso; }
    
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    
    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }
    
    public String getTokenSessao() { return tokenSessao; }
    public void setTokenSessao(String tokenSessao) { this.tokenSessao = tokenSessao; }
}
