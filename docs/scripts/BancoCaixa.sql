-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(10) NOT NULL CHECK (perfil IN ('ADMIN', 'OPERADOR')),
    status VARCHAR(10) NOT NULL CHECK (status IN ('ATIVO', 'INATIVO'))
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    quantidade_estoque DECIMAL(10,3) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS vendas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_recebido DECIMAL(10,2) NOT NULL,
    troco DECIMAL(10,2) NOT NULL,
    usuario_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de Itens de Venda
CREATE TABLE IF NOT EXISTS venda_itens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venda_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de Movimentações de Estoque
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP NOT NULL,
    tipo VARCHAR(1) NOT NULL CHECK (tipo IN ('E', 'S', 'I')),
    produto_id BIGINT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    estoque_anterior DECIMAL(10,3) NOT NULL,
    estoque_atual DECIMAL(10,3) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    usuario_id BIGINT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);