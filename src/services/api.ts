const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res: Response) {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    // if backend sent JSON error, throw that
    if (data) throw data;
    throw new Error(res.statusText);
  }

  return data;
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
}

export async function apiPost<T = any>(
  path: string,
  body: any
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: isFormData
      ? {
          // 🚫 do NOT set Content-Type for FormData
          ...getAuthHeaders(),
        }
      : {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
    body: isFormData ? body : JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiPut<T = any>(
  path: string,
  body: any
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
}
