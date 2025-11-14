import { GameObject } from 'game/prototypes'
import { EntityUnits, Unit } from '../types'

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
  manager,
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

  manager?.(unit)
}
