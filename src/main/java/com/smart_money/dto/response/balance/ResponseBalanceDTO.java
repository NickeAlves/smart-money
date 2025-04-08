package com.smart_money.dto.response.balance;

import java.math.BigDecimal;

public record ResponseBalanceDTO(BigDecimal totalIncomes,
                                 BigDecimal totalExpenses,
                                 BigDecimal netBalance) {
}
