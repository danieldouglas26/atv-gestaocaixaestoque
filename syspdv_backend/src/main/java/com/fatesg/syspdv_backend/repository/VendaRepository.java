package com.fatesg.syspdv_backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fatesg.syspdv_backend.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    
    List<Venda> findByUsuarioId(Long usuarioId);
    
    List<Venda> findByDataHoraBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
    
    @Query("SELECT v FROM Venda v WHERE v.valorTotal BETWEEN :valorMinimo AND :valorMaximo")
    List<Venda> findByValorTotalBetween(@Param("valorMinimo") BigDecimal valorMinimo, 
                                       @Param("valorMaximo") BigDecimal valorMaximo);
    
    @Query("SELECT COUNT(v), SUM(v.valorTotal) FROM Venda v WHERE v.dataHora BETWEEN :dataInicio AND :dataFim")
    Object[] findResumoVendasPorPeriodo(@Param("dataInicio") LocalDateTime dataInicio, 
                                       @Param("dataFim") LocalDateTime dataFim);
}