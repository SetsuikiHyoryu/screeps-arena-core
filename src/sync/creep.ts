import { Creep } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { CreepState } from '../enums'
import { unitCreator, syncUnitsFactory } from '../utils'
import { useManager } from '../manager'
import { creepUnits } from '../units'

export const syncCreepUnits = () => {
  const creeps = getObjectsByPrototype(Creep).filter((creep) => creep.my)
  const { creepManager: manager } = useManager()

  syncUnitsFactory({
    entities: creeps,
    entityUnits: creepUnits,
    manager,
    unitCreator: (creep) =>
      unitCreator({
        entity: creep,
        codeName: `Creep${creep.id}`,
        state: CreepState.Idle,
        entityUnits: creepUnits,
        manager,
        isSync: true,
      }),
  })
}
