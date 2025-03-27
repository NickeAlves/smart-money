package com.smart_money.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateUserDTO(@NotBlank(message = "Name cannot be blank")
                            @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
                            String name,

                            @NotBlank(message = "Please, enter your last name")
                            String lastName,

                            @Email(message = "Email must be valid")
                            @NotBlank(message = "Email cannot be blank")
                            String email,

                            @NotBlank(message = "Password cannot be blank")
                            @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
                            String password,

                            @Positive(message = "Age must be positive")
                            Integer age) {
}
