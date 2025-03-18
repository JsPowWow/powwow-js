/**
 * @description Toggle provided boolean value to the opposite one
 */
export default function toggle<V extends boolean>(value: V): boolean {
  return value !== true;
}
