import {type TabsEvent, layout} from './tabs.ts'

export function createTabsReference() {
  let selectedIndex = 0
  function render(viewportWidth: number, viewportHeight: number, events: readonly TabsEvent[]) {
    const rowLeft = viewportWidth / 2 - layout.tabCount * layout.tabWidth / 2
    const rowTop = viewportHeight / 2 - layout.tabHeight / 2
    for (const {x, y} of events) {
      if (y < rowTop || y >= rowTop + layout.tabHeight) continue
      for (let index = 0; index < layout.tabCount; index++) {
        const tabLeft = rowLeft + index * layout.tabWidth
        if (x >= tabLeft && x < tabLeft + layout.tabWidth) {
          selectedIndex = index
          break
        }
      }
    }
    const selected = Array.from({length: layout.tabCount}, (_, index) => index === selectedIndex ? 1 : 0)
    return {rowLeft, rowTop, indicatorLeft: rowLeft + selectedIndex * layout.tabWidth, selected}
  }
  return {render}
}
