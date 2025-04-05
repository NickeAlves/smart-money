package com.smart_money.dto.request.expenses;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateExpenseDTO(@NotBlank(message = "Please, enter title of expense.")
                               String title,
                               String description,
                               @Positive(message = "Please, enter positive number.")
                               double value) {
}
