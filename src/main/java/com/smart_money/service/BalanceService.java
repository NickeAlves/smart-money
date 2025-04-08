package com.smart_money.service;

import com.smart_money.model.Balance;
import com.smart_money.repository.ExpenseRepository;
import com.smart_money.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BalanceService {
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public BalanceService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public Balance calculateBalanceByUserId(Long userId) {
        BigDecimal totalExpenses = expenseRepository.sumByOwnerId(userId).orElse(BigDecimal.ZERO);
        BigDecimal totalIncomes = incomeRepository.sumByOwnerId(userId).orElse(BigDecimal.ZERO);
        BigDecimal netBalance = totalIncomes.subtract(totalExpenses);

        return new Balance(totalIncomes, totalExpenses, netBalance);
    }
}
