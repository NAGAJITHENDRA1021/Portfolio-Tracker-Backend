package com.klef.jfsd.portfolio_tracker_backend.service;

import com.klef.jfsd.portfolio_tracker_backend.model.Stock;
import com.klef.jfsd.portfolio_tracker_backend.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    // Add a new Stock
    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }

    // Update an existing Stock
    public Stock updateStock(Long id, Stock updatedStock) {
        return stockRepository.findById(id)
                .map(stock -> {
                    stock.setName(updatedStock.getName());
                    stock.setTicker(updatedStock.getTicker());
                    stock.setQuantity(updatedStock.getQuantity());
                    stock.setBuyPrice(updatedStock.getBuyPrice());
                    return stockRepository.save(stock);
                }).orElseThrow(() -> new RuntimeException("Stock not found!"));
    }

    // Delete Stock
    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    // Get all Stocks
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    // Calculate Portfolio Value
    public BigDecimal calculatePortfolioValue() {
        return stockRepository.findAll().stream()
                .map(stock -> stock.getBuyPrice().multiply(BigDecimal.valueOf(stock.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
