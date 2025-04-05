package com.smart_money.controller;

import com.smart_money.dto.request.expenses.CreateExpenseDTO;
import com.smart_money.dto.request.expenses.UpdateExpenseDTO;
import com.smart_money.dto.response.expense.ResponseExpenseDTO;
import com.smart_money.model.Expense;
import com.smart_money.security.TokenService;
import com.smart_money.service.ExpenseService;
import com.smart_money.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;
    private final TokenService tokenService;
    private final UserService userService;

    public ExpenseController(ExpenseService expenseService, TokenService tokenService, UserService userService) {
        this.expenseService = expenseService;
        this.tokenService = tokenService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ResponseExpenseDTO<List<Expense>>> getAllExpenses() {
        List<Expense> expenses = expenseService.findAllExpenses();
        return ResponseEntity.ok(new ResponseExpenseDTO<>(true, expenses, "Expenses fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseExpenseDTO<Expense>> getExpenseById(@PathVariable Long id) {
        return expenseService.findExpenseById(id)
                .map(expense -> ResponseEntity.ok(new ResponseExpenseDTO<>(true, expense, "Expense found")))
                .orElse(ResponseEntity.status(404).body(new ResponseExpenseDTO<>(false, null, "Expense not found")));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ResponseExpenseDTO<List<Expense>>> getExpensesByUserId(@PathVariable Long ownerId) {
        List<Expense> expenses = expenseService.findAllExpensesByOwnerId(ownerId);
        return ResponseEntity.ok(new ResponseExpenseDTO<>(true, expenses, "Expenses for user fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ResponseExpenseDTO<Expense>> createExpense(@PathVariable Long ownerId,@Valid @RequestBody CreateExpenseDTO dto) {
        return userService.findUserById(ownerId).map(owner -> {
            Expense expense = new Expense(dto.title(), dto.description(), dto.value(), owner);
            Expense savedExpense = expenseService.createExpense(expense);
            return ResponseEntity.ok(new ResponseExpenseDTO<>(true, savedExpense, "Expense created  successfully."));
        }).orElse(ResponseEntity.badRequest()
                .body(new ResponseExpenseDTO<>(false, null, "Owner not found.")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseExpenseDTO<Expense>> updateExpense(@PathVariable Long id, @Valid @RequestBody UpdateExpenseDTO dto) {
        return expenseService.updateExpense(id, dto)
                .map(updated -> ResponseEntity.ok(new ResponseExpenseDTO<>(true, updated, "Expense updated successfully")))
                .orElse(ResponseEntity.notFound()
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseExpenseDTO<Void>> deleteExpense (@PathVariable Long id) {
        boolean deleted = expenseService.deleteExpense(id);
        if (deleted) {
            return ResponseEntity.ok(new ResponseExpenseDTO<>(true, null, "Expense deleted successfully"));
        }
        return ResponseEntity.status(404).body(new ResponseExpenseDTO<>(false, null, "Expense not found"));
    }
    }
