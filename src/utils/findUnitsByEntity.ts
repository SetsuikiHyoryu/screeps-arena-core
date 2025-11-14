import {
  ConstructionSite,
  Creep,
  GameObject,
  Source,
  StructureSpawn,
} from 'game/prototypes'
import { EntityUnits, Unit } from '../types'
import {
  constructionSiteUnits,
  creepUnits,
  sourceUnits,
  spawnUnits,
} from '../units'

interface EntityUnitsMap<Entity extends GameObject = GameObject> {
  check: (entity: Entity) => boolean
  units: EntityUnits<Unit<Entity>>
}

const entityUnitsMap: EntityUnitsMap[] = [
  {
    check: (entity) => entity instanceof ConstructionSite,
    units: constructionSiteUnits,
  },
  { check: (entity) => entity instanceof Creep, units: creepUnits },
  { check: (entity) => entity instanceof Source, units: sourceUnits },
  { check: (entity) => entity instanceof StructureSpawn, units: spawnUnits },
]

export const findUnitsByEntity = <Entity extends GameObject>(
  entity: Entity,
): EntityUnits<Unit<Entity>> => {
  const units = entityUnitsMap.find((item) => item.check(entity))?.units

  if (!units) {
    throw new Error('Cannot find units.')
  }

  return units as EntityUnits<Unit<Entity>>
}
