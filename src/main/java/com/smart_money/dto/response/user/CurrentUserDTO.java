package com.smart_money.dto.response.user;

public record CurrentUserDTO(Long id, String name,String lastName, String email, int age, String profileUrl) {
}
