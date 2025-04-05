package com.smart_money.dto.request.income;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UpdateIncomeDTO(@NotBlank(message = "Please, enter title of income")
                              String title,

                              String description,

                              @Positive(message = "Value must be positive")
                              double value) {
}
