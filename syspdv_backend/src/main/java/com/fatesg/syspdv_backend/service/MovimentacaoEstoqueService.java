package com.fatesg.syspdv_backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatesg.syspdv_backend.model.MovimentacaoEstoque;
import com.fatesg.syspdv_backend.model.Produto;
import com.fatesg.syspdv_backend.model.TipoMovimentacao;
import com.fatesg.syspdv_backend.repository.MovimentacaoEstoqueRepository;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    public void registrarMovimentacao(TipoMovimentacao tipo, Produto produto, BigDecimal quantidade,
            BigDecimal estoqueAnterior, BigDecimal estoqueAtual,
            String motivo) {

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque(
                tipo, produto, quantidade, estoqueAnterior, estoqueAtual, motivo);

        movimentacaoRepository.save(movimentacao);
    }

    public void registrarEntrada(Produto produto, BigDecimal quantidade, String motivo) {
        BigDecimal estoqueAtual = produto.getQuantidadeEstoque();
        BigDecimal estoqueAnterior = estoqueAtual.subtract(quantidade);

        registrarMovimentacao(TipoMovimentacao.ENTRADA, produto, quantidade,
                estoqueAnterior, estoqueAtual, motivo);
    }

    public void registrarSaida(Produto produto, BigDecimal quantidade, String motivo) {
        BigDecimal estoqueAnterior = produto.getQuantidadeEstoque();
        BigDecimal estoqueAtual = estoqueAnterior.subtract(quantidade);

        registrarMovimentacao(TipoMovimentacao.SAIDA, produto, quantidade,
                estoqueAnterior, estoqueAtual, motivo);
    }

    public void registrarAjuste(Produto produto, BigDecimal quantidade, String motivo) {
        BigDecimal estoqueAnterior = produto.getQuantidadeEstoque();
        BigDecimal estoqueAtual = estoqueAnterior.add(quantidade);

        registrarMovimentacao(TipoMovimentacao.INVENTARIO, produto, quantidade,
                estoqueAnterior, estoqueAtual, motivo);
    }

    public void registrarCriacaoProduto(Produto produto) {
        String motivo = "Criação do produto - Estoque inicial";
        registrarEntrada(produto, produto.getQuantidadeEstoque(), motivo);
    }

    public List<MovimentacaoEstoque> buscarPorProduto(Long produtoId) {
        return movimentacaoRepository.findByProdutoIdOrderByDataHoraDesc(produtoId);
    }

    public List<MovimentacaoEstoque> buscarPorTipo(TipoMovimentacao tipo) {
        return movimentacaoRepository.findByTipoOrderByDataHoraDesc(tipo);
    }

    public List<MovimentacaoEstoque> buscarPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return movimentacaoRepository.findByDataHoraBetweenOrderByDataHoraDesc(dataInicio, dataFim);
    }

    public List<MovimentacaoEstoque> buscarPorProdutoEPeriodo(Long produtoId, LocalDateTime dataInicio,
            LocalDateTime dataFim) {
        return movimentacaoRepository.findByProdutoIdAndDataHoraBetweenOrderByDataHoraDesc(produtoId, dataInicio,
                dataFim);
    }
}