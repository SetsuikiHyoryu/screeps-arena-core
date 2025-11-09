import {
  syncConstructionSiteUnits,
  syncCreepUnits,
  syncSourceUnits,
  syncSpawnUnits,
} from './units'

export function loop() {
  syncConstructionSiteUnits()
  syncCreepUnits()
  syncSourceUnits()
  syncSpawnUnits()
}
