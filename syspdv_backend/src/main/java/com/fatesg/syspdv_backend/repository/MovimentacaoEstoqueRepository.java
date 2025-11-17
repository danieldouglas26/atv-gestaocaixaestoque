package com.fatesg.syspdv_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fatesg.syspdv_backend.model.MovimentacaoEstoque;
import com.fatesg.syspdv_backend.model.TipoMovimentacao;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    
    List<MovimentacaoEstoque> findByProdutoIdOrderByDataHoraDesc(Long produtoId);
    
    List<MovimentacaoEstoque> findByTipoOrderByDataHoraDesc(TipoMovimentacao tipo);
    
    List<MovimentacaoEstoque> findByDataHoraBetweenOrderByDataHoraDesc(LocalDateTime dataInicio, LocalDateTime dataFim);
    
    List<MovimentacaoEstoque> findByProdutoIdAndDataHoraBetweenOrderByDataHoraDesc(Long produtoId, LocalDateTime dataInicio, LocalDateTime dataFim);
    
    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.produto.id = :produtoId AND m.tipo = :tipo ORDER BY m.dataHora DESC")
    List<MovimentacaoEstoque> findByProdutoIdAndTipoOrderByDataHoraDesc(@Param("produtoId") Long produtoId, @Param("tipo") TipoMovimentacao tipo);
}