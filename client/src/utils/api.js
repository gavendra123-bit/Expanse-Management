const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = (token, hasJsonBody = true) => {
  const headers = {};

  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const registerUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const fetchExpenses = async (token) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    headers: getHeaders(token, false)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not load expenses");
  }

  return data;
};

export const createExpense = async (payload, token) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not create expense");
  }

  return data;
};
