package com.smart_money.dto.response.user;

public class ResponseUserDTO<T>  {
    private boolean success;
    private T token;
    private String message;

    public ResponseUserDTO(boolean success, T token, String message) {
        this.success = success;
        this.token = token;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getToken() {
        return token;
    }

    public void setToken(T token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
