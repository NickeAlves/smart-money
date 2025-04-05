package com.smart_money.dto.request.expenses;

import jakarta.validation.constraints.Positive;

public record UpdateExpenseDTO(String title,
                               String description,
                               @Positive(message = "Value must be positive")
                               Double value) {
}
