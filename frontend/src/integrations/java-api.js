"use client";

const API_BASE_URL = "http://localhost:8080";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || "Request failed";
    throw new Error(errorMessage);
  }
  return response.json();
};

const api = {
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(false),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async updateUser(id, user) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(user),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async uploadProfilePicture(id, file) {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`${API_BASE_URL}/users/${id}/upload-profile`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    return handleResponse(response);
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(errorMessage || "Failed to delete user");
    }
    return true;
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Logout failed:", await response.text());
    }
  },

  async refreshLogin(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Logout failed:", await response.text());
    }
    const responseLogin = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    return handleResponse(responseLogin);
  },

  async verifyPassword(password) {
    const response = await fetch(`${API_BASE_URL}/users/verify-password`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ password }),
      credentials: "include",
    });
    return handleResponse(response);
  },

  isAuthenticated() {
    return fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders(),
      credentials: "include",
    }).then((res) => res.ok);
  },
};

export default api;
