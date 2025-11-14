import type { Manager } from '../types'
import { useS1ConstructAndControlManager } from './season1/construct_and_control/useS1ConstructAndControlManager'

export const useManager = (): Partial<Manager> => {
  return { ...useS1ConstructAndControlManager() }
}
