import {input, event, oneHot, stateBit} from '../handwired/src/runtime/cells.ts'

export const layout = {tabCount: 3, tabWidth: 96, tabHeight: 36} as const
const coordinate = () => input([-16_384, 16_384], {grid: 1 / 64})

export const tabsCells = {
  viewportWidth: input([0, 16_384], {initial: 1280, grid: 1}),
  viewportHeight: input([0, 16_384], {initial: 800, grid: 1}),
  down: {active: event(), x: coordinate(), y: coordinate()},
  selected: oneHot([stateBit(1), stateBit(), stateBit()]),
}
