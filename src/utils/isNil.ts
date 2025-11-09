/**
 * 判断一个值是否为空值（Nil）。
 *
 * @param value - 任意值。
 * @returns 是否为空值。
 */
export const isNil = (value: unknown): value is undefined | null => {
  return value === undefined || value === null
}
