import { ATTACK, CARRY, ERR_BUSY, HEAL, MOVE, WORK } from 'game/constants'
import { CreepState, SpawnState } from '../enums'
import type { CreepUnit, SpawnUnit } from '../types'
import { creepUnits } from '../units'
import type { Creep } from 'game/prototypes'
import type { BodyPartType } from 'game/prototypes/creep'
import { unitCreator } from '../utils'
import { creepManager } from '../manager/season1/construct_and_control/creepManager'

const spawnCreepErrorMap: Partial<
  Record<number, (spawn: SpawnUnit, body: BodyPartType[]) => any>
> = {
  [ERR_BUSY]: (spawn, body) => {
    console.log(`${spawn.codeName} is spawning ${body} creep...`)
    spawn.state = SpawnState.Spawning
  },
}

const spawnCreep = (
  spawn: SpawnUnit,
  codeName: string,
  body: BodyPartType[],
): Creep | undefined => {
  const { object, error } = spawn.entity.spawnCreep(body)

  if (error !== undefined || !object) {
    const printError = spawnCreepErrorMap[error ?? 0]

    if (printError) {
      printError(spawn, body)
      return
    }

    console.log(`Fail to spawn ${body} creep: ${error}.`)
    spawn.state = SpawnState.Idle
    return
  }

  unitCreator({
    entity: object,
    codeName,
    state: CreepState.Idle,
    manager: creepManager,
  })

  spawn.state = SpawnState.Idle
}

const findCreepUnits = (bodyPartType: BodyPartType): CreepUnit[] => {
  return Object.values(creepUnits).filter((creep) =>
    creep.entity.body.some((part) => part.type === bodyPartType),
  )
}

export const triggerSpawnStateMachine = (spawn: SpawnUnit) => {
  const workers = findCreepUnits(WORK)
  if (workers.length < 3) {
    spawnCreep(spawn, `Worker${workers.length + 1}`, [WORK, MOVE, CARRY, MOVE])
    return
  }

  const attackers = findCreepUnits(ATTACK)
  if (attackers.length < 3) {
    spawnCreep(spawn, `Attacker${attackers.length + 1}`, [ATTACK, MOVE])
    return
  }

  const healers = findCreepUnits(HEAL)
  if (healers.length < 3) {
    spawnCreep(spawn, `Healer${healers.length + 1}`, [HEAL, MOVE])
    return
  }
}
