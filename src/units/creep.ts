import { Creep } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import type {
  CreepUnit,
  EntityUnitCreatorParameters,
  EntityUnits,
} from '../types'
import { CreepState } from '../enums'
import { unitCreator, syncUnitsFactory } from './utils'
import { useManager } from '../manager'

export const creepUnits: EntityUnits<CreepUnit> = {}

export const creepUnitCreator = ({
  entity,
  codeName = `Creep${entity.id}`,
  isSync = false,
}: EntityUnitCreatorParameters<Creep>) => {
  unitCreator({
    entity,
    codeName,
    state: CreepState.Idle,
    entityUnits: creepUnits,
    manager: useManager().creepManager,
    isSync,
  })
}

export const syncCreepUnits = () => {
  const creeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  syncUnitsFactory({
    entities: creeps,
    entityUnits: creepUnits,
    manager: useManager().creepManager,
    unitCreator: (creep) => creepUnitCreator({ entity: creep, isSync: true }),
  })
}
