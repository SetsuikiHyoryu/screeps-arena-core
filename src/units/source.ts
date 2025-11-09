import { Source } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { SourceState } from '../enums/state'
import type {
  EntityUnitCreatorParameters,
  EntityUnits,
  SourceUnit,
} from '../types'
import { syncUnitsFactory, unitCreator } from './utils'

export const sourceUnits: EntityUnits<SourceUnit> = {}

export const sourceUnitCreator = ({
  entity,
  codeName = `Source${entity.id}`,
  isSync = false,
}: EntityUnitCreatorParameters<Source>) => {
  unitCreator({
    entity,
    codeName,
    state: entity.energy > 0 ? SourceState.HasSource : SourceState.NoSource,
    entityUnits: sourceUnits,
    isSync,
  })
}

export const syncSourceUnits = () => {
  const sources = getObjectsByPrototype(Source)
  syncUnitsFactory({
    entities: sources,
    entityUnits: sourceUnits,
    unitCreator: (source) =>
      sourceUnitCreator({ entity: source, isSync: true }),
  })
}
