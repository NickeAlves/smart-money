package com.smart_money.dto.response.balance;

import com.smart_money.model.Currency;

import java.math.BigDecimal;

public record ResponseBalanceDTO(BigDecimal totalIncomes,
                                 BigDecimal totalExpenses,
                                 BigDecimal netBalance,
                                 Currency currency) {
}
