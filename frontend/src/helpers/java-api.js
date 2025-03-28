const API_BASE_URL = "http://localhost:8080";

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  if (isJson) {
    return { "Content-type": "application/json", ...headers };
  }
  return headers;
};

const api = {
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(false),
    });
    return response.ok ? response.json() : null;
  },

  async updateUser(id, user) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    return response.ok ? response.json() : null;
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });
    return response.ok;
  },

  async register(name, lastName, email, password, age) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, lastName, email, password, age }),
      headers: { "Content-Type": "application/json" },
    });
    return response.ok ? response.json() : null;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    return response.ok ? response.json() : null;
  },

  async logout() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          localStorage.removeItem("token");
        } else {
          console.error("Falha no logout:", await response.text());
        }
      } catch (error) {
        console.error("Erro no logout:", error);
      }
    } else {
      localStorage.removeItem("token");
    }
  },
};
export default api;
