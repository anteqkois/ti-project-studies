import { Order } from "../../common"

type OrderInput<T> = {
  [K in keyof T]?: Order | OrderInput<T[K]> // Ensures nested ordering
}

export const orderByToPipelineSort = <T extends object>(order: OrderInput<T>) => {
  const orderByField: Record<string, any> = {} // Using Record<string, any> for flexibility

  for (const [field, orderOption] of Object.entries(order)) {
    if (!orderOption) continue
    if (typeof orderOption === 'string') {
      orderByField[field] = orderOption === 'asc' ? 1 : -1
    } else {
      // Nested sort
      // orderByField[field] = prismaOrderByToPipelineSort(orderOption, true)
			throw new Error(`nested order isn't supported yet`)
    }
  }

  return orderByField
}
