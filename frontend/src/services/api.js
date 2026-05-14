const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchJson = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  // Handle empty responses (like 204 No Content) safely
  if (response.status === 204) return null;

  return response.json();
};