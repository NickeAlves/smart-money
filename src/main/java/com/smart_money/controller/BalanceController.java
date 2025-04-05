package com.smart_money.controller;

import com.smart_money.model.Balance;
import com.smart_money.model.Currency;
import com.smart_money.service.BalanceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/balance")
public class BalanceController {
    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping
    public Balance getBalance(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "EUR") Currency currency) {
        return balanceService.calculateBalanceByUserId(userId, currency);
    }
}
