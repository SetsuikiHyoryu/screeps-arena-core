import { Source } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { SourceState } from '../enums/state'
import { syncUnitsFactory, unitCreator } from '../utils'

export const syncSourceUnits = () => {
  const sources = getObjectsByPrototype(Source)
  syncUnitsFactory({
    entities: sources,
    unitCreator: (source) =>
      unitCreator({
        entity: source,
        codeName: `Source${source.id}`,
        state: source.energy > 0 ? SourceState.HasSource : SourceState.NoSource,
        isSync: true,
      }),
  })
}
