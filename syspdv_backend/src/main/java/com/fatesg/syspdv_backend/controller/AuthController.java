package com.fatesg.syspdv_backend.controller;

import com.fatesg.syspdv_backend.dto.LoginRequestDTO;
import com.fatesg.syspdv_backend.dto.LoginResponseDTO;
import com.fatesg.syspdv_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticação", description = "API para autenticação de usuários")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "Realizar login", description = "Autentica um usuário no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login processado com sucesso", 
                    content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Credenciais de login")
            @Valid @RequestBody LoginRequestDTO loginRequest) {
        
        LoginResponseDTO response = authService.login(loginRequest);
        
        if (response.isSucesso()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @Operation(summary = "Validar token", description = "Valida se um token de sessão é válido")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token validado"),
        @ApiResponse(responseCode = "401", description = "Token inválido")
    })
    @GetMapping("/validar-token")
    public ResponseEntity<Void> validarToken(
            @RequestParam String token) {
        
        boolean tokenValido = authService.validarTokenSessao(token);
        
        if (tokenValido) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(401).build();
        }
    }
    
    @Operation(summary = "Logout", description = "Realiza logout do usuário (apaga sessão no frontend)")
    @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}