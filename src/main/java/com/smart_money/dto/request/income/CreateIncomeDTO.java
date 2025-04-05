package com.smart_money.dto.request.income;

import com.smart_money.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateIncomeDTO(@NotBlank(message = "Please, enter title of income")
                              String title,

                              String description,

                              @NotNull
                              @Positive(message = "Value must be positive")
                              Double value,

                              @NotNull
                              User owner
                              ) {
}
