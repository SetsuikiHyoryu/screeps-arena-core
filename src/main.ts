import {
  syncConstructionSiteUnits,
  syncCreepUnits,
  syncSourceUnits,
  syncSpawnUnits,
} from './sync'

export function loop() {
  syncConstructionSiteUnits()
  syncCreepUnits()
  syncSourceUnits()
  syncSpawnUnits()
}
