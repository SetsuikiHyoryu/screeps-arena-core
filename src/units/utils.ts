import type { GameObject } from 'game/prototypes'
import type { EntityUnits, Unit } from '../types'
import { isNil } from '../utils'

type UnitCreatorParameters<Entity extends GameObject, State> = Unit<
  Entity,
  State
> & {
  entityUnits: EntityUnits<Unit<Entity, State>>
  manager?: (unit: Unit<Entity, State>) => void
  isSync?: boolean
}

export const unitCreator = <Entity extends GameObject, State>({
  entity,
  codeName,
  state,
  entityUnits,
  manager: stateMachine,
  isSync = false,
}: UnitCreatorParameters<Entity, State>) => {
  const unit: Unit<Entity, State> = {
    codeName,
    entity,
    state,
  }

  entityUnits[entity.id] = unit

  if (!isSync) {
    console.log(`${unit.codeName} has been created.`)
  }

  stateMachine?.(unit)
}

interface SyncUnitsFactoryParameters<Entity extends GameObject> {
  entities: Entity[]
  entityUnits: EntityUnits<Unit<Entity>>
  manager?: (unit: Unit<Entity, any>) => void
  unitCreator: (entity: Entity) => void
}

export const syncUnitsFactory = <Entity extends GameObject>({
  entities,
  entityUnits,
  manager,
  unitCreator: creator,
}: SyncUnitsFactoryParameters<Entity>) => {
  entities.forEach((entity) => {
    const unit = entityUnits[entity.id]

    if (!isNil(unit)) {
      manager?.(unit)
      return
    }

    creator(entity)
  })
}
