package com.smart_money.service;

import com.smart_money.dto.response.balance.ResponseBalanceDTO;
import com.smart_money.model.Balance;
import com.smart_money.model.Currency;
import com.smart_money.model.User;
import com.smart_money.repository.ExpenseRepository;
import com.smart_money.repository.IncomeRepository;
import com.smart_money.repository.UserRepository;
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

    public Balance calculateBalanceByUserId(Long userId, Currency currency) {
        BigDecimal totalExpenses = expenseRepository.sumByOwnerId(userId).orElse(BigDecimal.ZERO);
        BigDecimal totalIncomes = incomeRepository.sumByOwnerId(userId).orElse(BigDecimal.ZERO);
        BigDecimal netBalance = totalIncomes.subtract(totalExpenses);

        return new Balance(totalIncomes, totalExpenses, netBalance, currency);
    }
}
