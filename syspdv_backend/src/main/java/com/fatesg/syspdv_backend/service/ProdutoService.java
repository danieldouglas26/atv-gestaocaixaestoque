package com.fatesg.syspdv_backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fatesg.syspdv_backend.dto.ProdutoRequestDTO;
import com.fatesg.syspdv_backend.dto.ProdutoResponseDTO;
import com.fatesg.syspdv_backend.model.Produto;
import com.fatesg.syspdv_backend.repository.ProdutoRepository;

@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ProdutoResponseDTO> buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .map(this::toResponseDTO);
    }
    
    public Optional<ProdutoResponseDTO> buscarPorCodigo(String codigo) {
        return produtoRepository.findByCodigo(codigo)
                .map(this::toResponseDTO);
    }
    
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO produtoDTO) {
        if (produtoRepository.existsByCodigo(produtoDTO.getCodigo())) {
            throw new RuntimeException("Já existe um produto com o código: " + produtoDTO.getCodigo());
        }
        
        if (produtoDTO.getQuantidadeEstoque().compareTo(BigDecimal.ZERO) < 0 ) {
            throw new RuntimeException("Quantidade em estoque não pode ser negativa");
        }
        
        Produto produto = new Produto();
        produto.setCodigo(produtoDTO.getCodigo());
        produto.setNome(produtoDTO.getNome());
        produto.setCategoria(produtoDTO.getCategoria());
        produto.setQuantidadeEstoque(produtoDTO.getQuantidadeEstoque());
        produto.setPrecoUnitario(produtoDTO.getPrecoUnitario());
        
        Produto produtoSalvo = produtoRepository.save(produto);
        return toResponseDTO(produtoSalvo);
    }
    
    public Optional<ProdutoResponseDTO> atualizarProduto(Long id, ProdutoRequestDTO produtoDTO) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    if (!produto.getCodigo().equals(produtoDTO.getCodigo()) && 
                        produtoRepository.existsByCodigo(produtoDTO.getCodigo())) {
                        throw new RuntimeException("Já existe um produto com o código: " + produtoDTO.getCodigo());
                    }
                    
                    if (produtoDTO.getQuantidadeEstoque().compareTo(BigDecimal.ZERO) < 0) {
                        throw new RuntimeException("Quantidade em estoque não pode ser negativa");
                    }
                    
                    produto.setCodigo(produtoDTO.getCodigo());
                    produto.setNome(produtoDTO.getNome());
                    produto.setCategoria(produtoDTO.getCategoria());
                    produto.setQuantidadeEstoque(produtoDTO.getQuantidadeEstoque());
                    produto.setPrecoUnitario(produtoDTO.getPrecoUnitario());
                    
                    Produto produtoAtualizado = produtoRepository.save(produto);
                    return toResponseDTO(produtoAtualizado);
                });
    }
    
    public boolean deletarProduto(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        return new ProdutoResponseDTO(
            produto.getId(),
            produto.getCodigo(),
            produto.getNome(),
            produto.getCategoria(),
            produto.getQuantidadeEstoque(),
            produto.getPrecoUnitario()
        );
    }
    
    @Transactional
    public ProdutoResponseDTO baixarEstoque(Long id, BigDecimal quantidade) {
        if (quantidade.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantidade para baixa deve ser maior que zero");
        }
        
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        
        if (produto.getQuantidadeEstoque().compareTo(quantidade) < 0) {
            throw new RuntimeException("Estoque insuficiente. Disponível: " + produto.getQuantidadeEstoque() + ", Solicitado: " + quantidade);
        }
        
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque().add(quantidade.negate()));
        Produto produtoAtualizado = produtoRepository.save(produto);
        
        return toResponseDTO(produtoAtualizado);
    }
    

    @Transactional
    public ProdutoResponseDTO baixarEstoquePorCodigo(String codigo, BigDecimal quantidade) {
        if (quantidade.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantidade para baixa deve ser maior que zero");
        }
        
        Produto produto = produtoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com código: " + codigo));
        
        if (produto.getQuantidadeEstoque().compareTo(quantidade) < 0) {
            throw new RuntimeException("Estoque insuficiente. Disponível: " + produto.getQuantidadeEstoque() + ", Solicitado: " + quantidade);
        }
        
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque().add(quantidade.negate()));
        Produto produtoAtualizado = produtoRepository.save(produto);
        
        return toResponseDTO(produtoAtualizado);
    }
    

    @Transactional
    public ProdutoResponseDTO reporEstoque(Long id, BigDecimal quantidade) {
        if (quantidade.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantidade para reposição deve ser maior que zero");
        }
        
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque().add(quantidade));
        Produto produtoAtualizado = produtoRepository.save(produto);
        
        return toResponseDTO(produtoAtualizado);
    }
    

    @Transactional
    public ProdutoResponseDTO ajustarEstoque(Long id, BigDecimal quantidade, String motivo) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        
        BigDecimal novoEstoque = produto.getQuantidadeEstoque().add(quantidade);
        
        if (novoEstoque.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Ajuste resultaria em estoque negativo. Estoque atual: " + produto.getQuantidadeEstoque() + ", Ajuste: " + quantidade);
        }
        
        produto.setQuantidadeEstoque(novoEstoque);
        Produto produtoAtualizado = produtoRepository.save(produto);
        

        System.out.println("Ajuste de estoque - Produto: " + produto.getNome() + 
                          ", "
                          + ": " + quantidade + ", Motivo: " + motivo);
        
        return toResponseDTO(produtoAtualizado);
    }
    
    public boolean verificarEstoqueSuficiente(Long id, BigDecimal quantidade) {
        return produtoRepository.findById(id)
                .map(produto -> produto.getQuantidadeEstoque().compareTo(quantidade) >= 0)
                .orElse(false);
    }
    
    public boolean verificarEstoqueSuficientePorCodigo(String codigo, BigDecimal quantidade) {
        return produtoRepository.findByCodigo(codigo)
                .map(produto -> produto.getQuantidadeEstoque().compareTo(quantidade) >= 0)
                .orElse(false);
    }
    
    public BigDecimal obterQuantidadeEstoque(Long id) {
        return produtoRepository.findById(id)
                .map(Produto::getQuantidadeEstoque)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
    }
    

    public BigDecimal obterQuantidadeEstoquePorCodigo(String codigo) {
        return produtoRepository.findByCodigo(codigo)
                .map(Produto::getQuantidadeEstoque)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com código: " + codigo));
    }
    
}