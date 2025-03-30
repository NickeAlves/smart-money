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
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(false),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(false),
    });
    return handleResponse(response);
  },

  async updateUser(id, user) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return true;
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await handleResponse(response);
    return data;
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });

    if (response.ok) {
      console.log("Logout successful");
      localStorage.removeItem("token");
    } else {
      console.error("Logout failed:", await response.text());
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    return token ? true : false;
  },

  async refreshToken() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }

    return false;
  },
};

export default api;
