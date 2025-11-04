package com.fatesg.syspdv_backend.model;

public enum StatusUsuario {
    ATIVO("A", "Ativo"),
    INATIVO("I", "Inativo");
    
    private final String sigla;
    private final String descricao;
    
    StatusUsuario(String sigla, String descricao) {
        this.sigla = sigla;
        this.descricao = descricao;
    }
    
    public String getSigla() {
        return sigla;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static StatusUsuario fromSigla(String sigla) {
        for (StatusUsuario status : values()) {
            if (status.sigla.equalsIgnoreCase(sigla)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Sigla de status inválida: " + sigla);
    }
    
    public static StatusUsuario fromString(String value) {
        try {
            return StatusUsuario.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return fromSigla(value.toUpperCase());
        }
    }
}