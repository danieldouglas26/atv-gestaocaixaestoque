package com.fatesg.syspdv_backend.model;

public enum PerfilUsuario {
    ADMIN("ADM", "Administrador"),
    OPERADOR("OPE", "Operador");
    
    private final String sigla;
    private final String descricao;
    
    PerfilUsuario(String sigla, String descricao) {
        this.sigla = sigla;
        this.descricao = descricao;
    }
    
    public String getSigla() {
        return sigla;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static PerfilUsuario fromSigla(String sigla) {
        for (PerfilUsuario perfil : values()) {
            if (perfil.sigla.equalsIgnoreCase(sigla)) {
                return perfil;
            }
        }
        throw new IllegalArgumentException("Sigla de perfil inválida: " + sigla);
    }
    
    public static PerfilUsuario fromString(String value) {
        try {
            return PerfilUsuario.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return fromSigla(value.toUpperCase());
        }
    }
}