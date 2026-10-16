import {expect, test} from 'bun:test'
import {createTabsReference} from './tabs-reference.ts'
import {type TabsEvent, createTabsMachine} from './tabs.ts'

test('the program and plain JavaScript pick the same tab for every press', () => {
  const machine = createTabsMachine()
  const reference = createTabsReference()
  const presses: {press: TabsEvent, selected: number[]}[] = [
    {press: {x: 640, y: 400}, selected: [0, 1, 0]},
    {press: {x: 496, y: 382}, selected: [1, 0, 0]},
    {press: {x: 495.984375, y: 400}, selected: [1, 0, 0]},
    {press: {x: 688, y: 400}, selected: [0, 0, 1]},
    {press: {x: 784, y: 400}, selected: [0, 0, 1]},
    {press: {x: 592, y: 417.984375}, selected: [0, 1, 0]},
    {press: {x: 640, y: 418}, selected: [0, 1, 0]},
  ]
  for (const {press, selected} of presses) {
    machine.queue(press)
    const output = machine.step(1280, 800)
    const expected = reference.render(1280, 800, [press])
    expect(output).toEqual(expected)
    expect(output.selected).toEqual(selected)
  }
})

test('two presses in one frame apply in order', () => {
  const machine = createTabsMachine()
  const reference = createTabsReference()
  const presses = [{x: 700, y: 400}, {x: 520, y: 400}]
  for (const press of presses) machine.queue(press)
  expect(machine.step(1280, 800)).toEqual(reference.render(1280, 800, presses))
})

test('the table check rejects a press off the 1/64 px grid', () => {
  const machine = createTabsMachine()
  machine.queue({x: 640.001, y: 400})
  expect(() => machine.step(1280, 800)).toThrow('down.x must be a multiple of 0.015625')
})
