import type { Manager } from '../../../types'
import { creepManager } from './creepManager'
import { spawnManager } from './spawnManager'

export const useS1ConstructAndControlManager = (): Partial<Manager> => {
  return {
    creepManager,
    spawnManager,
  }
}
