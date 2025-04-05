package com.smart_money.service;

import com.smart_money.dto.request.expenses.UpdateExpenseDTO;
import com.smart_money.model.Expense;
import com.smart_money.model.User;
import com.smart_money.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> findAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> findExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Optional<User> findExpenseOwnerByExpenseId(Long expenseId) {
        return expenseRepository.findById(expenseId)
                .map(Expense::getOwner);
    }

    public List<Expense> findAllExpensesByOwnerId(Long ownerId) {
        return expenseRepository.findAllByOwnerId(ownerId);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Optional<Expense> updateExpense(Long id, UpdateExpenseDTO dto) {
        return expenseRepository.findById(id).map(existingExpense -> {
            if (dto.title() != null) existingExpense.setTitle(dto.title());
            if (dto.description() != null) existingExpense.setDescription(dto.description());
            if (dto.value() != null && dto.value() > 0) existingExpense.setValue(dto.value());
            return expenseRepository.save(existingExpense);
        });
    }

    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
