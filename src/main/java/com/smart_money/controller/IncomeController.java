package com.smart_money.controller;

import com.smart_money.dto.request.income.CreateIncomeDTO;
import com.smart_money.dto.request.income.UpdateIncomeDTO;
import com.smart_money.model.Income;
import com.smart_money.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incomes")
public class IncomeController {
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public List<Income> getAllIncomes() {
        return incomeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncomeById(@PathVariable Long id) {
        return incomeService.findIncomeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(@Valid @RequestBody CreateIncomeDTO dto) {
        Income income = incomeService.createIncome(dto);
        return ResponseEntity.ok(income);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @Valid @RequestBody UpdateIncomeDTO dto) {
        return incomeService.updateIncome(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        if (incomeService.deleteIncome(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
