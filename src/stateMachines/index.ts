import type { CreepUnit, SpawnUnit } from '../types'
import { creepConstructionSiteBuilder } from './creepConstructionSiteBuilder'
import { spawnConstructionSiteBuilder } from './spawnConstructionSiteBuilder'

export const creepStateMachineTrigger = (creep: CreepUnit) => {
  creepConstructionSiteBuilder(creep)
}

export const spawnStateMachineTrigger = (spawn: SpawnUnit) => {
  spawnConstructionSiteBuilder(spawn)
}
