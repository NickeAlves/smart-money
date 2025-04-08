package com.smart_money.model;

import java.math.BigDecimal;

public class Balance {
    private BigDecimal totalIncomes;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;

    public Balance(BigDecimal totalIncomes, BigDecimal totalExpenses, BigDecimal netBalance) {
        this.totalIncomes = totalIncomes;
        this.totalExpenses = totalExpenses;
        this.netBalance = netBalance;
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

}
