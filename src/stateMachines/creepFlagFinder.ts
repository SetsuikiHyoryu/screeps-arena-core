import { getObjectsByPrototype } from 'game/utils'
import { CreepState } from '../enums/index'
import type { CreepUnit } from '../types'
import { Flag } from 'game/prototypes'
import { isNil, notify } from '../utils/index'
import type { CreepMoveResult } from 'game/prototypes/creep'
import { OK } from 'game/constants'

const moveResultMap: Partial<
  Record<
    CreepMoveResult,
    (parameters: { creep: CreepUnit; flag: Flag }) => void
  >
> = {
  [OK]: ({ creep, flag }) => {
    notify({
      data: `${creep.codeName} is moving to Flag${flag.id} (${flag.x}, ${flag.y}) ...`,
    })
  },
}

const moveToFlag = (creep: CreepUnit) => {
  const entity = creep.entity
  const [flag] = getObjectsByPrototype(Flag)

  if (isNil(flag)) {
    notify({ data: `${creep.codeName} can't find flag.` })
    return
  }

  const isOnFlag = entity.x === flag.x && entity.y === flag.y

  if (isOnFlag) {
    creep.state = CreepState.Idle
    notify({ data: `${creep.codeName} getted Flag${flag.id}` })
    return
  }

  const result = entity.moveTo(flag)
  const next = moveResultMap[result]
  next?.({ creep, flag })
}

const stateMap: Partial<Record<CreepState, (creep: CreepUnit) => void>> = {
  [CreepState.Idle]: (creep) => {
    moveToFlag(creep)
  },
}

export const creepFlagFinder = (creep: CreepUnit) => {
  const action = stateMap[creep.state]
  action?.(creep)
}
