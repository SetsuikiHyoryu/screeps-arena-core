import type { Manager } from '../types'
import { useS1ConstructAndControlManager } from './season1/construct_and_control'

export const useManager = (): Partial<Manager> => {
  return { ...useS1ConstructAndControlManager() }
}
