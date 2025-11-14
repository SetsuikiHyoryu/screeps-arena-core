import { GameObject } from 'game/prototypes'
import { Unit } from '../types'
import { findUnitsByEntity } from './findUnitsByEntity'

type UnitCreatorParameters<Entity extends GameObject, State> = Unit<
  Entity,
  State
> & {
  manager?: (unit: Unit<Entity, State>) => void
  isSync?: boolean
}

export const unitCreator = <Entity extends GameObject, State>({
  entity,
  codeName,
  state,
  manager,
  isSync = false,
}: UnitCreatorParameters<Entity, State>) => {
  const unit: Unit<Entity, State> = {
    codeName,
    entity,
    state,
  }

  const units = findUnitsByEntity(entity)
  units[entity.id] = unit

  if (!isSync) {
    console.log(`${unit.codeName} has been created.`)
  }

  manager?.(unit)
}
