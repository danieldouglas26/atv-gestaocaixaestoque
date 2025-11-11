package com.fatesg.syspdv_backend.model;

public enum TipoMovimentacao {
    ENTRADA("E", "Entrada"),
    SAIDA("S", "Saída"),
    INVENTARIO("I", "Inventário");
    
    private final String codigo;
    private final String descricao;
    
    TipoMovimentacao(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static TipoMovimentacao fromCodigo(String codigo) {
        for (TipoMovimentacao tipo : values()) {
            if (tipo.codigo.equalsIgnoreCase(codigo)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Código de movimentação inválido: " + codigo);
    }
}