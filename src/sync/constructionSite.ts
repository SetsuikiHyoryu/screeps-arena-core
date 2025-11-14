import { ConstructionSite } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { ConstructionSiteState } from '../enums/index'
import { constructionSiteUnits } from '../units'
import { syncUnitsFactory, unitCreator } from '../utils'

export const syncConstructionSiteUnits = () => {
  const sites = getObjectsByPrototype(ConstructionSite).filter(
    (site) => site.my,
  )

  const isConstructing = (entity: ConstructionSite) =>
    (entity.progress ?? 0) < (entity.progressTotal ?? 0)

  syncUnitsFactory({
    entities: sites,
    entityUnits: constructionSiteUnits,
    unitCreator: (constructionSite) =>
      unitCreator({
        entity: constructionSite,
        codeName: `ConstructionSite${constructionSite.id}`,
        state: isConstructing(constructionSite)
          ? ConstructionSiteState.Constructing
          : ConstructionSiteState.Comleted,
        entityUnits: constructionSiteUnits,
        isSync: true,
      }),
  })
}
