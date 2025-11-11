package com.fatesg.syspdv_backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fatesg.syspdv_backend.dto.EstoqueMovimentacaoRequestDTO;
import com.fatesg.syspdv_backend.dto.EstoqueVerificacaoRequestDTO;
import com.fatesg.syspdv_backend.dto.ProdutoRequestDTO;
import com.fatesg.syspdv_backend.dto.ProdutoResponseDTO;
import com.fatesg.syspdv_backend.model.Produto;
import com.fatesg.syspdv_backend.repository.ProdutoRepository;

@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;
    
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
        
        
        movimentacaoEstoqueService.registrarCriacaoProduto(produtoSalvo);
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
    public ProdutoResponseDTO baixarEstoque(EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        validarMovimentacaoDTO(movimentacaoDTO);
        
        if (movimentacaoDTO.getQuantidade().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantidade para baixa deve ser maior que zero");
        }
        
        Produto produto = obterProduto(movimentacaoDTO);
        
        if (produto.getQuantidadeEstoque().compareTo(movimentacaoDTO.getQuantidade()) < 0) {
            throw new RuntimeException("Estoque insuficiente. Disponível: " + produto.getQuantidadeEstoque() + ", Solicitado: " + movimentacaoDTO.getQuantidade());
        }
        
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque().subtract(movimentacaoDTO.getQuantidade()));
        Produto produtoAtualizado = produtoRepository.save(produto);
        
        movimentacaoEstoqueService.registrarSaida(produtoAtualizado, movimentacaoDTO.getQuantidade(), 
                movimentacaoDTO.getMotivo());
        
        return toResponseDTO(produtoAtualizado);
    }

    @Transactional
    public ProdutoResponseDTO reporEstoque(EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        validarMovimentacaoDTO(movimentacaoDTO);
        
        if (movimentacaoDTO.getQuantidade().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantidade para reposição deve ser maior que zero");
        }
        
        Produto produto = obterProduto(movimentacaoDTO);
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque().add(movimentacaoDTO.getQuantidade()));
        Produto produtoAtualizado = produtoRepository.save(produto);
        movimentacaoEstoqueService.registrarEntrada(produtoAtualizado, movimentacaoDTO.getQuantidade(), 
                movimentacaoDTO.getMotivo());
        return toResponseDTO(produtoAtualizado);
    }

    @Transactional
    public ProdutoResponseDTO ajustarEstoque(EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        validarMovimentacaoDTO(movimentacaoDTO);
        
        Produto produto = obterProduto(movimentacaoDTO);
        BigDecimal novoEstoque = produto.getQuantidadeEstoque().add(movimentacaoDTO.getQuantidade());
        
        if (novoEstoque.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Ajuste resultaria em estoque negativo. Estoque atual: " + produto.getQuantidadeEstoque() + ", Ajuste: " + movimentacaoDTO.getQuantidade());
        }
        
        produto.setQuantidadeEstoque(novoEstoque);
        Produto produtoAtualizado = produtoRepository.save(produto);
        
        movimentacaoEstoqueService.registrarAjuste(produtoAtualizado, movimentacaoDTO.getQuantidade(), 
                movimentacaoDTO.getMotivo());
        
        return toResponseDTO(produtoAtualizado);
    }


    public boolean verificarEstoqueSuficiente(EstoqueVerificacaoRequestDTO verificacaoDTO) {
        validarVerificacaoDTO(verificacaoDTO);
        
        Produto produto = obterProdutoParaVerificacao(verificacaoDTO);
        return produto.getQuantidadeEstoque().compareTo(verificacaoDTO.getQuantidade()) >= 0;
    }

    private void validarMovimentacaoDTO(EstoqueMovimentacaoRequestDTO dto) {
        if (!dto.isValid()) {
            throw new RuntimeException("Deve ser informado pelo menos o ID ou o código do produto");
        }
    }

    private void validarVerificacaoDTO(EstoqueVerificacaoRequestDTO dto) {
        if (!dto.isValid()) {
            throw new RuntimeException("Deve ser informado pelo menos o ID ou o código do produto");
        }
    }

    private Produto obterProduto(EstoqueMovimentacaoRequestDTO dto) {
        if (dto.getProdutoId() != null) {
            return produtoRepository.findById(dto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + dto.getProdutoId()));
        } else {
            return produtoRepository.findByCodigo(dto.getCodigo())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com código: " + dto.getCodigo()));
        }
    }

    private Produto obterProdutoParaVerificacao(EstoqueVerificacaoRequestDTO dto) {
        if (dto.getProdutoId() != null) {
            return produtoRepository.findById(dto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + dto.getProdutoId()));
        } else {
            return produtoRepository.findByCodigo(dto.getCodigo())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com código: " + dto.getCodigo()));
        }
    }
    
}