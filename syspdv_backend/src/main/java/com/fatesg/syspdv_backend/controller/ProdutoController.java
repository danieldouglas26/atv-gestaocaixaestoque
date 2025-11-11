package com.fatesg.syspdv_backend.controller;

import com.fatesg.syspdv_backend.dto.*;
import com.fatesg.syspdv_backend.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
@Tag(name = "Produtos", description = "API para gerenciamento de produtos do estoque")
public class ProdutoController {
    
    @Autowired
    private ProdutoService produtoService;
    
    @Operation(summary = "Listar todos os produtos", description = "Retorna uma lista com todos os produtos cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de produtos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        List<ProdutoResponseDTO> produtos = produtoService.listarTodos();
        return ResponseEntity.ok(produtos);
    }
    
    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico baseado no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(
            @Parameter(description = "ID do produto", example = "1") 
            @PathVariable Long id) {
        Optional<ProdutoResponseDTO> produto = produtoService.buscarPorId(id);
        return produto.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Buscar produto por código", description = "Retorna um produto específico baseado no código")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado", content = @Content)
    })
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorCodigo(
            @Parameter(description = "Código do produto", example = "PROD001") 
            @PathVariable String codigo) {
        Optional<ProdutoResponseDTO> produto = produtoService.buscarPorCodigo(codigo);
        return produto.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Criar novo produto", description = "Cria um novo produto no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Produto criado com sucesso", 
                    content = @Content(schema = @Schema(implementation = ProdutoResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou código já cadastrado", 
                    content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> criarProduto(
            @Parameter(description = "Dados do produto a ser criado") 
            @Valid @RequestBody ProdutoRequestDTO produtoDTO) {
        try {
            ProdutoResponseDTO produtoCriado = produtoService.criarProduto(produtoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(produtoCriado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @Operation(summary = "Atualizar produto", description = "Atualiza os dados de um produto existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou código já cadastrado"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProduto(
            @Parameter(description = "ID do produto a ser atualizado", example = "1") 
            @PathVariable Long id,
            @Parameter(description = "Novos dados do produto") 
            @Valid @RequestBody ProdutoRequestDTO produtoDTO) {
        try {
            Optional<ProdutoResponseDTO> produtoAtualizado = produtoService.atualizarProduto(id, produtoDTO);
            return produtoAtualizado.map(ResponseEntity::ok)
                                  .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @Operation(summary = "Excluir produto", description = "Remove um produto do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Produto excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(
            @Parameter(description = "ID do produto a ser excluído", example = "1") 
            @PathVariable Long id) {
        boolean deletado = produtoService.deletarProduto(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    // NOVOS ENDPOINTS COM BODY
    
    @Operation(summary = "Baixar estoque", description = "Realiza baixa de estoque para venda")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estoque baixado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou estoque insuficiente"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PostMapping("/baixar-estoque")
    public ResponseEntity<?> baixarEstoque(
            @Parameter(description = "Dados para baixa de estoque") 
            @Valid @RequestBody EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        try {
            ProdutoResponseDTO produtoAtualizado = produtoService.baixarEstoque(movimentacaoDTO);
            return ResponseEntity.ok(produtoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Repor estoque", description = "Realiza reposição de estoque")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estoque reposto com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PostMapping("/repor-estoque")
    public ResponseEntity<?> reporEstoque(
            @Parameter(description = "Dados para reposição de estoque") 
            @Valid @RequestBody EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        try {
            ProdutoResponseDTO produtoAtualizado = produtoService.reporEstoque(movimentacaoDTO);
            return ResponseEntity.ok(produtoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Ajustar estoque", description = "Realiza ajuste de estoque (positivo ou negativo)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estoque ajustado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou estoque insuficiente"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PostMapping("/ajustar-estoque")
    public ResponseEntity<?> ajustarEstoque(
            @Parameter(description = "Dados para ajuste de estoque") 
            @Valid @RequestBody EstoqueMovimentacaoRequestDTO movimentacaoDTO) {
        try {
            ProdutoResponseDTO produtoAtualizado = produtoService.ajustarEstoque(movimentacaoDTO);
            return ResponseEntity.ok(produtoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Verificar estoque", description = "Verifica se há estoque suficiente para uma quantidade")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verificação realizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    @PostMapping("/verificar-estoque")
    public ResponseEntity<?> verificarEstoque(
            @Parameter(description = "Dados para verificação de estoque") 
            @Valid @RequestBody EstoqueVerificacaoRequestDTO verificacaoDTO) {
        try {
            boolean estoqueSuficiente = produtoService.verificarEstoqueSuficiente(verificacaoDTO);
            return ResponseEntity.ok(estoqueSuficiente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}