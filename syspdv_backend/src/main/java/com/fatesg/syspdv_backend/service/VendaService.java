package com.fatesg.syspdv_backend.service;

import com.fatesg.syspdv_backend.dto.*;
import com.fatesg.syspdv_backend.model.Produto;
import com.fatesg.syspdv_backend.model.Usuario;
import com.fatesg.syspdv_backend.model.Venda;
import com.fatesg.syspdv_backend.model.VendaItem;
import com.fatesg.syspdv_backend.repository.ProdutoRepository;
import com.fatesg.syspdv_backend.repository.UsuarioRepository;
import com.fatesg.syspdv_backend.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendaService {
    
    @Autowired
    private VendaRepository vendaRepository;
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProdutoService produtoService;
    
    
    @Transactional
    public VendaResponseDTO registrarVenda(VendaRequestDTO vendaDTO) {

        if (vendaDTO.getItens() == null || vendaDTO.getItens().isEmpty()) {
            throw new RuntimeException("A venda deve conter pelo menos um item");
        }
        
        if (vendaDTO.getValorRecebido().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor recebido deve ser maior que zero");
        }
        
        Usuario usuario = usuarioRepository.findById(vendaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + vendaDTO.getUsuarioId()));
        
        Venda venda = new Venda();
        venda.setUsuario(usuario);
        venda.setValorRecebido(vendaDTO.getValorRecebido());
        
        BigDecimal valorTotal = BigDecimal.ZERO;
        
        for (VendaItemRequestDTO itemDTO : vendaDTO.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + itemDTO.getProdutoId()));
            
            if (!produtoService.verificarEstoqueSuficiente(produto.getId(), itemDTO.getQuantidade())) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome() + 
                                         ". Disponível: " + produto.getQuantidadeEstoque() + 
                                         ", Solicitado: " + itemDTO.getQuantidade());
            }
            
            VendaItem vendaItem = new VendaItem();
            vendaItem.setProduto(produto);
            vendaItem.setQuantidade(itemDTO.getQuantidade());
            vendaItem.setPrecoUnitario(produto.getPrecoUnitario());
            vendaItem.calcularSubtotal();
            
            venda.adicionarItem(vendaItem);
            valorTotal = valorTotal.add(vendaItem.getSubtotal());
            
            produtoService.baixarEstoque(produto.getId(), itemDTO.getQuantidade());
        }
        
        venda.setValorTotal(valorTotal);
        venda.setTroco(vendaDTO.getValorRecebido().subtract(valorTotal));
        
        if (venda.getTroco().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor recebido é insuficiente. Total: " + valorTotal + 
                                     ", Recebido: " + vendaDTO.getValorRecebido());
        }
        
        Venda vendaSalva = vendaRepository.save(venda);
        
        return toResponseDTO(vendaSalva);
    }
    
    public List<VendaResponseDTO> listarTodas() {
        return vendaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<VendaResponseDTO> buscarPorId(Long id) {
        return vendaRepository.findById(id)
                .map(this::toResponseDTO);
    }
    
    public List<VendaResponseDTO> buscarPorUsuario(Long usuarioId) {
        return vendaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    private VendaResponseDTO toResponseDTO(Venda venda) {
        List<VendaItemResponseDTO> itensDTO = venda.getItens()
                .stream()
                .map(this::toItemResponseDTO)
                .collect(Collectors.toList());
        
        UsuarioResponseDTO usuarioDTO = toUsuarioResponseDTO(venda.getUsuario());
        
        return new VendaResponseDTO(
            venda.getId(),
            venda.getDataHora(),
            venda.getValorTotal(),
            venda.getValorRecebido(),
            venda.getTroco(),
            usuarioDTO,
            itensDTO
        );
    }
    
    private VendaItemResponseDTO toItemResponseDTO(VendaItem item) {
        ProdutoResponseDTO produtoDTO = toProdutoResponseDTO(item.getProduto());
        
        return new VendaItemResponseDTO(
            item.getId(),
            produtoDTO,
            item.getQuantidade(),
            item.getPrecoUnitario(),
            item.getSubtotal()
        );
    }
    
    private ProdutoResponseDTO toProdutoResponseDTO(Produto produto) {
        return new ProdutoResponseDTO(
            produto.getId(),
            produto.getCodigo(),
            produto.getNome(),
            produto.getCategoria(),
            produto.getQuantidadeEstoque(),
            produto.getPrecoUnitario()
        );
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