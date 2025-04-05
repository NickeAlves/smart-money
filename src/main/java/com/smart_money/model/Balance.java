package com.smart_money.model;

import java.math.BigDecimal;

public class Balance {
    private BigDecimal totalIncomes;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private Currency currency;

    public Balance(BigDecimal totalIncomes, BigDecimal totalExpenses, BigDecimal netBalance, Currency currency) {
        this.totalIncomes = totalIncomes;
        this.totalExpenses = totalExpenses;
        this.netBalance = netBalance;
        this.currency = currency;
    }

    public BigDecimal getTotalIncomes() {
        return totalIncomes;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public BigDecimal getNetBalance() {
        return netBalance;
    }

    public Currency getCurrency() {
        return currency;
    }


}
