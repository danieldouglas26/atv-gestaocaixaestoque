package com.fatesg.syspdv_backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatesg.syspdv_backend.dto.LoginRequestDTO;
import com.fatesg.syspdv_backend.dto.LoginResponseDTO;
import com.fatesg.syspdv_backend.dto.UsuarioResponseDTO;
import com.fatesg.syspdv_backend.model.Usuario;
import com.fatesg.syspdv_backend.repository.UsuarioRepository;

@Service
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());
        
        if (usuarioOpt.isEmpty()) {
            return LoginResponseDTO.falha("Usuário não encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (!usuario.getStatus().getSigla().equals("A")) {
            return LoginResponseDTO.falha("Usuário inativo");
        }
        
        if (!usuario.getSenha().equals(loginRequest.getSenha())) {
            return LoginResponseDTO.falha("Senha incorreta");
        }
        
        UsuarioResponseDTO usuarioDTO = toUsuarioResponseDTO(usuario);
        
        String tokenSessao = gerarTokenSessao();
        
        return LoginResponseDTO.sucesso(usuarioDTO, tokenSessao);
    }
    
    public boolean validarTokenSessao(String tokenSessao) {
        return tokenSessao != null && !tokenSessao.trim().isEmpty() && tokenSessao.startsWith("session_");
    }
    
    public Optional<UsuarioResponseDTO> buscarUsuarioPorToken(String tokenSessao) {
        return Optional.empty();
    }
    

    private String gerarTokenSessao() {
        return "session_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNomeCompleto(usuario.getNomeCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setPerfil(usuario.getPerfil().getSigla());
        dto.setPerfilDescricao(usuario.getPerfil().getDescricao());
        dto.setStatus(usuario.getStatus().getSigla());
        dto.setStatusDescricao(usuario.getStatus().getDescricao());
        return dto;
    }
}