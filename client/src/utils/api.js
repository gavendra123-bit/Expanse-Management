const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = rawApiUrl
  ? rawApiUrl.replace(/\/$/, "").endsWith("/api")
    ? rawApiUrl.replace(/\/$/, "")
    : `${rawApiUrl.replace(/\/$/, "")}/api`
  : "/api";

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

const request = async (path, options = {}, fallbackMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    return parseResponse(response, fallbackMessage);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Cannot reach backend. Check Render URL and CLIENT_URLS on the server.");
    }

    throw error;
  }
};

const parseResponse = async (response, fallbackMessage) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson && (data?.message || data?.error)) {
      throw new Error(data.error ? `${data.message}: ${data.error}` : data.message);
    }

    throw new Error(
      `${fallbackMessage}. Check Vercel VITE_API_URL and Render CLIENT_URLS configuration.`
    );
  }

  if (!isJson) {
    throw new Error("API returned HTML instead of JSON. Check your deployed backend URL.");
  }

  return data;
};

export const registerUser = async (payload) => {
  return request(
    "/auth/register",
    {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
    },
    "Registration failed"
  );
};

export const loginUser = async (payload) => {
  return request(
    "/auth/login",
    {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
    },
    "Login failed"
  );
};

export const fetchExpenses = async (token) => {
  return request(
    "/expenses",
    {
      headers: getHeaders(token, false)
    },
    "Could not load expenses"
  );
};

export const createExpense = async (payload, token) => {
  return request(
    "/expenses",
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload)
    },
    "Could not create expense"
  );
};
