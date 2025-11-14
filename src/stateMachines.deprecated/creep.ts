import {
  ATTACK,
  ERR_NOT_IN_RANGE,
  HEAL,
  OK,
  RESOURCE_ENERGY,
  WORK,
} from 'game/constants'
import { CreepState } from '../enums/index'
import type { Action, CreepUnit, SpawnUnit } from '../types'
import { Creep, Source } from 'game/prototypes'
import { getObjectsByPrototype } from 'game/utils'
import { creepUnits, spawnUnits } from '../units/index'
import type {
  BodyPartType,
  CreepHarvestResult,
  CreepRangedAttackResult,
  CreepRangedHealResult,
  CreepTransferResult,
} from 'game/prototypes/creep'
import type { Position } from 'game/prototypes/game-object'

const checkCreepType = (creep: CreepUnit, type: BodyPartType) => {
  return creep.entity.body.some((part) => part.type === type)
}

const moveTo = (creep: CreepUnit, target: Position, targetName: string) => {
  creep.entity.moveTo(target)
  console.log(`${creep.codeName} is moving to ${targetName}...`)
  creep.state = CreepState.Moving
}

const handleNext = (
  creep: CreepUnit,
  result: number,
  next: Action | undefined,
) => {
  if (!next) {
    console.log(`${creep.codeName} ${creep.state} failed: ${result}`)
    creep.state = CreepState.Idle
    return
  }

  next()
}

const harvestResultMap: Partial<
  Record<CreepHarvestResult, (creep: CreepUnit, source: Source) => any>
> = {
  [OK]: (creep) => {
    console.log(`${creep.codeName} is harvesting...`)
    creep.state = CreepState.Harvesting
  },

  [ERR_NOT_IN_RANGE]: (creep, source) => {
    moveTo(creep, source, source.id.toString())
  },
}

const harvest = (creep: CreepUnit) => {
  const activeSources = getObjectsByPrototype(Source).filter(
    (source) => source.energy > 0,
  )

  const closestActiveSource = creep.entity.findClosestByPath(activeSources)
  const result = creep.entity.harvest(closestActiveSource)
  const next = harvestResultMap[result]
  handleNext(creep, result, next?.bind({}, creep, closestActiveSource))
}

const transferResultMap: Partial<
  Record<CreepTransferResult, (creep: CreepUnit, spawn: SpawnUnit) => any>
> = {
  [OK]: (creep) => {
    console.log(`${creep.codeName} has been transfered.`)
    creep.state = CreepState.Idle
  },

  [ERR_NOT_IN_RANGE]: (creep, spawn) => {
    moveTo(creep, spawn.entity, spawn.codeName)
  },
}

const transfer = (creep: CreepUnit) => {
  const target = creep.entity.findClosestByPath(
    Object.values(spawnUnits).map((spawn) => spawn.entity),
  )

  const spawnUnit = spawnUnits[target.id]!
  const result = creep.entity.transfer(target, RESOURCE_ENERGY)
  const next = transferResultMap[result]
  handleNext(creep, result, next?.bind({}, creep, spawnUnit))
}

const attackResultMap: Partial<
  Record<CreepRangedAttackResult, (creep: CreepUnit, target: Creep) => any>
> = {
  [OK]: (creep) => {
    console.log(`${creep.codeName} is attacking enemy...`)
    creep.state = CreepState.Attacking
  },

  [ERR_NOT_IN_RANGE]: (creep, target) => {
    moveTo(creep, target, `enemy${target.id.toString()}`)
  },
}

const attack = (creep: CreepUnit) => {
  const hostileCreeps = getObjectsByPrototype(Creep).filter((item) => !item.my)
  const target = creep.entity.findClosestByPath(hostileCreeps)
  const result = creep.entity.attack(target)
  const next = attackResultMap[result]
  handleNext(creep, result, next?.bind({}, creep, target))
}

const healResultMap: Partial<
  Record<CreepRangedHealResult, (creep: CreepUnit, target: CreepUnit) => any>
> = {
  [OK]: (creep, target) => {
    console.log(`${creep.codeName} is healing ${target.codeName}...`)
    creep.state = CreepState.Healing
  },

  [ERR_NOT_IN_RANGE]: (creep, target) => {
    moveTo(creep, target.entity, target.codeName)
  },
}

const heal = (creep: CreepUnit) => {
  const targets = Object.values(creepUnits)
    .map((creep) => creep.entity)
    .filter(
      (creep) =>
        creep.hits < creep.hitsMax ||
        creep.body.some((part) => part.type === ATTACK),
    )

  const target = creep.entity.findClosestByPath(targets)
  const result = creep.entity.heal(target)
  const next = healResultMap[result]
  handleNext(creep, result, next?.bind({}, creep, creepUnits[target.id]!))
}

const creepTypeActionMap: [
  (creep: CreepUnit) => boolean,
  (creep: CreepUnit) => any,
][] = [
  [
    (creep) => checkCreepType(creep, WORK),
    (creep) => {
      const freeCapacity = creep.entity.store.getFreeCapacity(RESOURCE_ENERGY)

      if (freeCapacity === null) {
        console.log(`${creep.codeName} needs CARRY body part.`)
        return
      }

      if (freeCapacity > 0) {
        harvest(creep)
        return
      }

      transfer(creep)
    },
  ],
  [(creep) => checkCreepType(creep, ATTACK), (creep) => attack(creep)],
  [(creep) => checkCreepType(creep, HEAL), (creep) => heal(creep)],
]

export const triggerCreepStateMachine = (creep: CreepUnit) => {
  const map = creepTypeActionMap.find(([mapper]) => mapper(creep))

  if (!map?.[1]) {
    const part = creep.entity.body.map((part) => part.type).join(', ')
    console.log(`${creep.codeName} has unhandled body part ${part}`)
    return
  }

  map[1](creep)
}
