import { StructureSpawn } from 'game/prototypes'
import type { EntityUnitCreatorParameters, SpawnUnit } from '../types'
import { syncUnitsFactory, unitCreator } from './utils'
import { SpawnState } from '../enums/index'
import { getObjectsByPrototype } from 'game/utils'
import { useManager } from '../manager'

export const spawnUnits: Record<string | number, SpawnUnit> = {}

export const spawnUnitCreator = ({
  entity,
  codeName = `Spawn${entity.id}`,
  isSync = false,
}: EntityUnitCreatorParameters<StructureSpawn>) => {
  unitCreator({
    entity,
    codeName,
    state: SpawnState.Idle,
    entityUnits: spawnUnits,
    manager: useManager().spawnManager,
    isSync,
  })
}

export const syncSpawnUnits = () => {
  const spawns = getObjectsByPrototype(StructureSpawn).filter(
    (spawn) => spawn.my,
  )

  syncUnitsFactory({
    entities: spawns,
    entityUnits: spawnUnits,
    manager: useManager().spawnManager,
    unitCreator: (spawn) => spawnUnitCreator({ entity: spawn, isSync: true }),
  })
}
