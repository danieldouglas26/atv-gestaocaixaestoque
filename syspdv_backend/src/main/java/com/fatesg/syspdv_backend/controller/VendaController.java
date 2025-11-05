package com.fatesg.syspdv_backend.controller;

import com.fatesg.syspdv_backend.dto.VendaRequestDTO;
import com.fatesg.syspdv_backend.dto.VendaResponseDTO;
import com.fatesg.syspdv_backend.service.VendaService;
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
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
@Tag(name = "Vendas", description = "API para gerenciamento de vendas")
public class VendaController {
    
    @Autowired
    private VendaService vendaService;
    
    @Operation(summary = "Registrar nova venda", description = "Registra uma nova venda no sistema com baixa automática de estoque")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venda registrada com sucesso", 
                    content = @Content(schema = @Schema(implementation = VendaResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou estoque insuficiente", 
                    content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> registrarVenda(
            @Parameter(description = "Dados da venda a ser registrada") 
            @Valid @RequestBody VendaRequestDTO vendaDTO) {
        try {
            VendaResponseDTO vendaRegistrada = vendaService.registrarVenda(vendaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(vendaRegistrada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @Operation(summary = "Listar todas as vendas", description = "Retorna uma lista com todas as vendas registradas")
    @ApiResponse(responseCode = "200", description = "Lista de vendas retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<VendaResponseDTO>> listarTodas() {
        List<VendaResponseDTO> vendas = vendaService.listarTodas();
        return ResponseEntity.ok(vendas);
    }
    
    @Operation(summary = "Buscar venda por ID", description = "Retorna uma venda específica baseada no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Venda encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Venda não encontrada", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<VendaResponseDTO> buscarPorId(
            @Parameter(description = "ID da venda", example = "1") 
            @PathVariable Long id) {
        Optional<VendaResponseDTO> venda = vendaService.buscarPorId(id);
        return venda.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Buscar vendas por usuário", description = "Retorna vendas realizadas por um usuário específico")
    @ApiResponse(responseCode = "200", description = "Lista de vendas retornada com sucesso")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<VendaResponseDTO>> buscarPorUsuario(
            @Parameter(description = "ID do usuário", example = "2") 
            @PathVariable Long usuarioId) {
        List<VendaResponseDTO> vendas = vendaService.buscarPorUsuario(usuarioId);
        return ResponseEntity.ok(vendas);
    }
}