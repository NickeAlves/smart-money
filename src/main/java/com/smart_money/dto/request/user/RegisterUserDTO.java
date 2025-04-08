package com.smart_money.dto.request.user;

import jakarta.validation.constraints.*;

public record RegisterUserDTO(@NotBlank(message = "Please, enter your name")
                              @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
                              String name,

                              @NotBlank(message = "Please, enter your last name")
                              @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
                              String lastName,

                              @Email(message = "Email must be valid")
                              @NotBlank(message = "Email cannot be blank")
                              String email,

                              @NotBlank(message = "Password cannot be blank")
                              @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
                              String password,

                              @Min(13)
                              @NotNull(message = "Age cannot be null")
                              @Positive(message = "Age must be positive")
                              Integer age) {
}
