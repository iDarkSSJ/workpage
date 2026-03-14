// T es un tipo generico para que pueda recibir cualquier tipo de dato
// ejemplo de uso: PaginatedResponse<User>
// asi se evita el uso de any en el codigo y evitamos tanto codigo fetch repetido
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
}
