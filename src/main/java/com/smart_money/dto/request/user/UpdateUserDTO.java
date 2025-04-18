package com.smart_money.dto.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record  UpdateUserDTO(@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
                            String name,

                            String lastName,

                            @Email(message = "Email must be valid")
                            String email,

                            @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
                            String password,

                            @Min(13)
                            @Positive(message = "Age must be positive")
                            Integer age,
                            String profileUrl) {
}
