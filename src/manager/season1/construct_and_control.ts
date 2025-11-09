import {
  creepStateMachineTrigger,
  spawnStateMachineTrigger,
} from '../../stateMachines/index'
import type { Manager } from '../../types'

export const useS1ConstructAndControlManager = (): Partial<Manager> => {
  return {
    creepManager: creepStateMachineTrigger,
    spawnManager: spawnStateMachineTrigger,
  }
}
