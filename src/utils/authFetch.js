import { BASE_URL } from "../url/BaseUrl";

const API_BASE = BASE_URL;

let refreshPromise = null;

// LOGOUT USER
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await fetch(`${API_BASE}/api/employee/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  }

  localStorage.clear();

  window.location.replace("/");
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = async () => {
  // Prevent multiple refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        await logoutUser();
        return null;
      }

      const response = await fetch(
        `${API_BASE}/api/employee/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        await logoutUser();
        return null;
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error("Refresh token error:", error);
      await logoutUser();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// AUTH FETCH
export const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  const request = async (accessToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  let response = await request(token);

  // ACCESS TOKEN EXPIRED
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      return null;
    }

    response = await request(newToken);
  }

  return response;
};