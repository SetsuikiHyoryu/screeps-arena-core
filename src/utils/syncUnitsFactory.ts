import { type GameObject } from 'game/prototypes'
import type { Unit } from '../types'
import { isNil } from './isNil'
import { findUnitsByEntity } from './findUnitsByEntity'

interface SyncUnitsFactoryParameters<Entity extends GameObject> {
  entities: Entity[]
  manager?: (unit: Unit<Entity, any>) => void
  unitCreator: (entity: Entity) => void
}

export const syncUnitsFactory = <Entity extends GameObject>({
  entities,
  manager,
  unitCreator,
}: SyncUnitsFactoryParameters<Entity>) => {
  entities.forEach((entity) => {
    const units = findUnitsByEntity(entity)
    const unit = units?.[entity.id]

    if (!isNil(unit)) {
      manager?.(unit)
      return
    }

    unitCreator(entity)
  })
}
