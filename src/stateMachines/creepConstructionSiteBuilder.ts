import {
  ERR_NOT_ENOUGH_RESOURCES,
  ERR_NOT_IN_RANGE,
  OK,
  RESOURCE_ENERGY,
} from 'game/constants'
import type {
  CreepBuildResult,
  CreepHarvestResult,
  CreepMoveResult,
} from 'game/prototypes/creep'
import { ConstructionSiteState, CreepState, SourceState } from '../enums/index'
import type {
  Action,
  ConstructionSiteUnit,
  CreepUnit,
  SourceUnit,
  Unit,
} from '../types'
import { isNil, notify } from '../utils/index'
import { constructionSiteUnits, sourceUnits } from '../units/index'
import type { GameObject } from 'game/prototypes'

const executeAction = (creep: CreepUnit, action: Action | undefined) => {
  if (isNil(action)) {
    notify({
      data: `Unhandled ${creep.codeName} ${creep.state} error.`,
      level: 'error',
    })
    creep.state = CreepState.Idle
    return
  }

  action()
}

const moveResultMap: Partial<
  Record<
    CreepMoveResult,
    <Target extends Unit>(creep: CreepUnit, target: Target) => void
  >
> = {
  [OK]: (creep, target) => {
    creep.state = CreepState.Moving
    const targetInfo = `${target.codeName} (${target.entity.x}, ${target.entity.y})`
    notify({ data: `${creep.codeName} is ${creep.state} to ${targetInfo}` })
  },
}

const move = <Entity extends GameObject>(
  creep: CreepUnit,
  target: Unit<Entity>,
) => {
  const result = creep.entity.moveTo(target.entity)
  const action = moveResultMap[result]
  executeAction(creep, action?.bind({}, creep, target))
}

const harvestReslutMap: Partial<
  Record<CreepHarvestResult, (creep: CreepUnit, source: SourceUnit) => void>
> = {
  [OK]: (creep) => {
    creep.state = CreepState.Harvesting
    notify({ data: `${creep.codeName} is ${creep.state}...` })
  },

  [ERR_NOT_IN_RANGE]: (creep, source) => {
    creep.state = CreepState.Moving
    notify({ data: `${source.codeName} is not in ${creep.codeName} range.` })
    move(creep, source)
  },
}

const harvest = (creep: CreepUnit) => {
  const sources = Object.values(sourceUnits)
    .filter((source) => source.state === SourceState.HasSource)
    .map((source) => source.entity)

  const closestSource = creep.entity.findClosestByPath(sources)

  if (isNil(closestSource)) {
    notify({ data: `${creep.codeName}: no source colud be harvest.` })
    creep.state = CreepState.Idle
    return
  }

  const result = creep.entity.harvest(closestSource)
  const action = harvestReslutMap[result]
  executeAction(creep, () => action?.(creep, sourceUnits[closestSource.id]!))
}

const buildResultMap: Partial<
  Record<
    CreepBuildResult,
    (creep: CreepUnit, constructionSite: ConstructionSiteUnit) => void
  >
> = {
  [OK]: (creep) => {
    creep.state = CreepState.Building
    notify({ data: `${creep.codeName} is ${creep.state}...` })
  },

  [ERR_NOT_ENOUGH_RESOURCES]: (creep) => {
    creep.state = CreepState.Harvesting
    notify({ data: `${creep.codeName} has not not enough resource.` })
    harvest(creep)
  },

  [ERR_NOT_IN_RANGE]: (creep, site) => {
    creep.state = CreepState.Moving
    notify({ data: `${site.codeName} is not in ${creep.codeName} range.` })
    move(creep, site)
  },
}

const build = (creep: CreepUnit) => {
  const [closestConstructingSite] = Object.values(constructionSiteUnits)
    .filter((site) => site.state === ConstructionSiteState.Constructing)
    .map((site) => site.entity)

  if (isNil(closestConstructingSite)) {
    notify({ data: `No construciton site could be build.` })
    creep.state = CreepState.Idle
    return
  }

  const result = creep.entity.build(closestConstructingSite)
  const action = buildResultMap[result]

  executeAction(
    creep,
    action?.bind({}, creep, constructionSiteUnits[closestConstructingSite.id]!),
  )
}

const getStoredEnergyAndCapacity = (
  creep: CreepUnit,
): { storedEnergy: number; capacity: number } => {
  const storedEnergy = creep.entity.store?.[RESOURCE_ENERGY] ?? 0
  const capacity = creep.entity.store.getCapacity() ?? 0
  return { storedEnergy, capacity }
}

const assignTaskMap: [
  (creep: CreepUnit) => boolean,
  (creep: CreepUnit) => void,
][] = [
  [
    (creep) => {
      const { storedEnergy, capacity } = getStoredEnergyAndCapacity(creep)
      return storedEnergy < capacity
    },
    (creep) => {
      harvest(creep)
    },
  ],
  [
    (creep) => {
      const { storedEnergy, capacity } = getStoredEnergyAndCapacity(creep)
      return storedEnergy >= capacity
    },
    (creep) => {
      build(creep)
    },
  ],
]

const handleAssignTaskMap = (creep: CreepUnit) => {
  const map = assignTaskMap.find(([condition]) => condition(creep))

  if (isNil(map)) {
    notify({
      data: `${creep.codeName} is ${creep.state}...`,
      level: 'error',
    })
    return
  }

  const [_, assignTask] = map
  assignTask(creep)
}

const stateActionMap: Partial<Record<CreepState, (creep: CreepUnit) => void>> =
  {
    [CreepState.Idle]: (creep) => handleAssignTaskMap(creep),
    [CreepState.Moving]: (creep) => handleAssignTaskMap(creep),
    [CreepState.Building]: (creep) => build(creep),
    [CreepState.Harvesting]: (creep) => handleAssignTaskMap(creep),
  }

export const creepConstructionSiteBuilder = (creep: CreepUnit) => {
  const action = stateActionMap[creep.state]
  action?.(creep)
}
