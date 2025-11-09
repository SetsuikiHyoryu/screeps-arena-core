import { ConstructionSite } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import type {
  ConstructionSiteUnit,
  EntityUnitCreatorParameters,
  EntityUnits,
} from '../types'
import { syncUnitsFactory, unitCreator } from './utils'
import { ConstructionSiteState } from '../enums/index'

export const constructionSiteUnits: EntityUnits<ConstructionSiteUnit> = {}

export const constructionSiteUnitCreator = ({
  entity,
  codeName = `ConstructionSite${entity.id}`,
  isSync = false,
}: EntityUnitCreatorParameters<ConstructionSite>) => {
  unitCreator({
    entity,
    codeName,
    state:
      (entity.progress ?? 0) < (entity.progressTotal ?? 0)
        ? ConstructionSiteState.Constructing
        : ConstructionSiteState.Comleted,
    entityUnits: constructionSiteUnits,
    isSync,
  })
}

export const syncConstructionSiteUnits = () => {
  const sites = getObjectsByPrototype(ConstructionSite).filter(
    (site) => site.my,
  )

  syncUnitsFactory({
    entities: sites,
    entityUnits: constructionSiteUnits,
    unitCreator: (constructionSite) =>
      constructionSiteUnitCreator({ entity: constructionSite, isSync: true }),
  })
}
