const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function buildHeaders(json = true): HeadersInit {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function handleResponse(res: Response) {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // No JSON body
  }

  if (!res.ok) {
    if (data) throw data;
    throw new Error(res.statusText);
  }

  return data;
}


export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(),
  });

  return handleResponse(res);
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: isFormData ? buildHeaders(false) : buildHeaders(true),
    body: isFormData ? body : JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiPut<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(false),
  });

  return handleResponse(res);
}
