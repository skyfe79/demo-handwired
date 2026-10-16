import {type Wire, emitCompare, emitSelect} from '../handwired/src/runtime/numeric-ui-core.ts'
import {createSourceTable, event, input, oneHot, stateBit} from '../handwired/src/runtime/cells.ts'

export const layout = {tabCount: 3, tabWidth: 96, tabHeight: 36} as const
const coordinate = () => input([-16_384, 16_384], {grid: 1 / 64})

export const tabsCells = {
  viewportWidth: input([0, 16_384], {initial: 1280, grid: 1}),
  viewportHeight: input([0, 16_384], {initial: 800, grid: 1}),
  down: {active: event(), x: coordinate(), y: coordinate()},
  selected: oneHot([stateBit(1), stateBit(), stateBit()]),
}

export function buildTabs() {
  const table = createSourceTable()
  const cells = table.declare(tabsCells)
  const circuit = table.createCircuit()

  const rowLeft = circuit.affine([[cells.viewportWidth, 0.5]], -layout.tabCount * layout.tabWidth / 2)
  const rowTop = circuit.affine([[cells.viewportHeight, 0.5]], -layout.tabHeight / 2)
  const all = (...bits: Wire[]) => circuit.reglu([], 1, bits.map(bit => [bit, 1] as const), 1 - bits.length)

  const insideTab = (index: number, point: {x: Wire, y: Wire}) => {
    const tabLeft = circuit.affine([[rowLeft, 1]], index * layout.tabWidth)
    return all(
      emitCompare(circuit, point.x, '>=', tabLeft),
      emitCompare(circuit, point.x, '<', circuit.affine([[tabLeft, 1]], layout.tabWidth)),
      emitCompare(circuit, point.y, '>=', rowTop),
      emitCompare(circuit, point.y, '<', circuit.affine([[rowTop, 1]], layout.tabHeight)),
    )
  }

  const pressed = cells.selected.map((_, index) => all(cells.down.active, insideTab(index, cells.down)))

  const pressedAny = circuit.affine(pressed.map(bit => [bit, 1] as const))
  const selected = cells.selected.map((bit, index) => emitSelect(circuit, pressedAny, bit, pressed[index]!))
  const indicatorLeft = circuit.affine([[rowLeft, 1], ...selected.map((bit, index) => [bit, index * layout.tabWidth] as const)])

  table.next(cells.selected, selected)
  const output = {rowLeft, rowTop, indicatorLeft, selected}
  return {cells, output, ...table.finish()}
}
