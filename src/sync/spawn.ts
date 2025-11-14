import { StructureSpawn } from 'game/prototypes'
import { syncUnitsFactory, unitCreator } from '../utils'
import { SpawnState } from '../enums'
import { getObjectsByPrototype } from 'game/utils'
import { useManager } from '../manager'
import { spawnUnits } from '../units'

export const syncSpawnUnits = () => {
  const spawns = getObjectsByPrototype(StructureSpawn).filter(
    (spawn) => spawn.my,
  )

  const { spawnManager: manager } = useManager()

  syncUnitsFactory({
    entities: spawns,
    entityUnits: spawnUnits,
    manager,
    unitCreator: (spawn) =>
      unitCreator({
        entity: spawn,
        codeName: `Spawn${spawn.id}`,
        state: SpawnState.Idle,
        entityUnits: spawnUnits,
        manager,
        isSync: true,
      }),
  })
}
