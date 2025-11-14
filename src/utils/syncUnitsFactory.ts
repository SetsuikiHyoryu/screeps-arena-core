import { type GameObject } from 'game/prototypes'
import type { EntityUnits, Unit } from '../types'
import { isNil } from './isNil'

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
  unitCreator,
}: SyncUnitsFactoryParameters<Entity>) => {
  entities.forEach((entity) => {
    const unit = entityUnits[entity.id]

    if (!isNil(unit)) {
      manager?.(unit)
      return
    }

    unitCreator(entity)
  })
}
