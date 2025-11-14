import { CARRY, ERR_BUSY, MOVE, WORK } from 'game/constants'
import type { Creep } from 'game/prototypes'
import type { BodyPartType } from 'game/prototypes/creep'
import { ERR_NOT_ENOUGH_ENERGY } from 'game'
import { creepManager } from './creepManager'
import { CreepUnit, SpawnUnit } from '../../../types'
import { CreepState, SpawnState } from '../../../enums'
import { isNil, notify, unitCreator } from '../../../utils'
import { creepUnits } from '../../../units'

const spawnCreepErrorMap: Partial<
  Record<number, (spawn: SpawnUnit, body: BodyPartType[]) => any>
> = {
  [ERR_BUSY]: (spawn, body) => {
    spawn.state = SpawnState.Spawning
    console.log(`${spawn.codeName} is ${spawn.state} ${body} creep...`)
  },

  [ERR_NOT_ENOUGH_ENERGY]: (spawn) => {
    spawn.state = SpawnState.Spawning
    console.log(
      `${spawn.codeName} is ${spawn.state} but has not enough energy.`,
    )
  },
}

const spawnCreep = (
  spawn: SpawnUnit,
  codeNamePrefix: string,
  body: BodyPartType[],
): Creep | undefined => {
  const { object, error } = spawn.entity.spawnCreep(body)

  if (isNil(error) && object?.id) {
    const codeName = `${codeNamePrefix}${object.id}`

    unitCreator({
      entity: object,
      codeName,
      state: CreepState.Idle,
      entityUnits: creepUnits,
      manager: creepManager,
      isSync: true,
    })

    spawn.state = SpawnState.Idle
    console.log({ data: `${spawn.codeName} created ${codeName}` })
    return
  }

  const printError = spawnCreepErrorMap[error ?? 0]

  if (printError) {
    printError(spawn, body)
    return
  }

  spawn.state = SpawnState.Idle
  console.log(`Fail to spawn ${body} creep ${object}: ${error}.`)
}

const findCreepUnits = (bodyPartType: BodyPartType): CreepUnit[] => {
  return Object.values(creepUnits).filter((creep) =>
    creep.entity.body.some((part) => part.type === bodyPartType),
  )
}

const creepTypeMap: [() => boolean, (spawn: SpawnUnit) => void][] = [
  [
    () => findCreepUnits(WORK).length < 9,
    (spawn) => {
      spawnCreep(spawn, 'Worker', [
        ...Array.from({ length: 1 }, () => WORK),
        ...Array.from({ length: 1 }, () => CARRY),
        ...Array.from({ length: 2 }, () => MOVE),
      ] as BodyPartType[])
    },
  ],
]

const doSpawn = (spawn: SpawnUnit) => {
  const map = creepTypeMap.find(([condition]) => condition())

  if (!map) {
    return
  }

  const [_, action] = map
  action(spawn)
}

const stateMap: Partial<Record<SpawnState, (spawn: SpawnUnit) => void>> = {
  [SpawnState.Idle]: (spawn) => doSpawn(spawn),
  [SpawnState.Spawning]: (spawn) => doSpawn(spawn),
}

export const spawnManager = (spawn: SpawnUnit) => {
  const action = stateMap[spawn.state]

  if (isNil(action)) {
    notify({ data: `${spawn.codeName} has unhandled state.`, level: 'error' })
    return
  }

  action(spawn)
}
