const API_BASE_URL = "http://localhost:8080";

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  if (isJson) {
    return {
      "Content-Type": "application/json",
      ...headers,
    };
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Request failed");
  }
  return response.json();
};

const api = {
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(false),
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
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  async logout() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (response.ok) {
        localStorage.removeItem("token");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },
};

export default api;
