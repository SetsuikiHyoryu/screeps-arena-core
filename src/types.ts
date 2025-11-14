import type {
  ConstructionSite,
  Creep,
  GameObject,
  Source,
  StructureSpawn,
} from 'game/prototypes'
import type {
  ConstructionSiteState,
  CreepState,
  SourceState,
  SpawnState,
} from './enums/index'

export interface Unit<Entity extends GameObject = GameObject, State = unknown> {
  entity: Entity
  codeName: string
  state: State
}

export type ConstructionSiteUnit = Unit<ConstructionSite, ConstructionSiteState>
export type CreepUnit = Unit<Creep, CreepState>
export type SourceUnit = Unit<Source, SourceState>
export type SpawnUnit = Unit<StructureSpawn, SpawnState>

export type EntityUnits<U extends Unit> = Record<string | number, U>

export interface Manager {
  creepManager: (creep: CreepUnit) => void
  spawnManager: (spawn: SpawnUnit) => void
}

export type Action = (...any: any) => any
