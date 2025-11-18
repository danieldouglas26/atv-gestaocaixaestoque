package com.fatesg.syspdv_backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatesg.syspdv_backend.dto.UsuarioRequestDTO;
import com.fatesg.syspdv_backend.dto.UsuarioResponseDTO;
import com.fatesg.syspdv_backend.model.PerfilUsuario;
import com.fatesg.syspdv_backend.model.StatusUsuario;
import com.fatesg.syspdv_backend.model.Usuario;
import com.fatesg.syspdv_backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toResponseDTO);
    }

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado: " + usuarioDTO.getEmail());
        }

        PerfilUsuario perfil = usuarioDTO.getPerfilAsEnum();
        StatusUsuario status = usuarioDTO.getStatusAsEnum();

        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(usuarioDTO.getNomeCompleto());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setSenha(usuarioDTO.getSenha());
        usuario.setPerfil(perfil);
        usuario.setStatus(status);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return toResponseDTO(usuarioSalvo);
    }

    public Optional<UsuarioResponseDTO> atualizarUsuario(Long id, UsuarioRequestDTO usuarioDTO) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (!usuario.getEmail().equals(usuarioDTO.getEmail()) &&
                            usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
                        throw new RuntimeException("E-mail já cadastrado: " + usuarioDTO.getEmail());
                    }

                    PerfilUsuario perfil = usuarioDTO.getPerfilAsEnum();
                    StatusUsuario status = usuarioDTO.getStatusAsEnum();

                    usuario.setNomeCompleto(usuarioDTO.getNomeCompleto());
                    usuario.setEmail(usuarioDTO.getEmail());
                    usuario.setSenha(usuarioDTO.getSenha());
                    usuario.setPerfil(perfil);
                    usuario.setStatus(status);

                    Usuario usuarioAtualizado = usuarioRepository.save(usuario);
                    return toResponseDTO(usuarioAtualizado);
                });
    }

    public boolean deletarUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
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
