const API_URL = import.meta.env.VITE_API_URL as string

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// <T> tipo generico para que pueda recibir cualquier tipo de dato
// ejemplo de uso: request<User>("/users/1")
// asi se evita el uso de any en el codigo y evitamos tanto codigo fetch repetido
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data.error ?? "Error del servidor" }
    }

    return { success: true, data: data as T }
  } catch {
    return { success: false, error: "Error del servidor" }
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
