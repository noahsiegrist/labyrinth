import store from '@/store'
import Tile from '@/helpers/tile'

function getNeighbors(element) {
  const matrix = store.getters.matrix
  const maxY = matrix.length - 1
  const maxX = matrix[element.y].length - 1
  const neighbors = []
  if (!element.right && element.x < maxX) neighbors.push(matrix[element.y][element.x + 1])
  if (!element.bottom && element.y < maxY) neighbors.push(matrix[element.y + 1][element.x])
  if (!element.left && element.x > 0) neighbors.push(matrix[element.y][element.x - 1])
  if (!element.top && element.y > 0) neighbors.push(matrix[element.y - 1][element.x])
  return neighbors
}

function sleep(ms) {
  if (!ms || ms <= 0) return Promise.resolve()
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function colorPath(element, color, pathDelayMs) {
  while (element) {
    await sleep(pathDelayMs)
    element.color = color
    store.commit('tile', element)
    element = element.parent
  }
}

// Generic runner: frontier behavior is provided by the caller
async function run({ popFrontier, pushFrontier, stepDelayMs = 1, pathDelayMs = 50 }) {
  const frontier = []

  function add(element, parent) {
    if (element.color === 0) {
      element.parent = parent
      element.color = 1
      store.commit('tile', element)
      pushFrontier(frontier, element)
    }
  }

  add(store.getters.start, null)

  while (frontier.length) {
    await sleep(stepDelayMs)
    const element = popFrontier(frontier)

    if (Tile.equals(element, store.getters.end)) {
      return colorPath(element, 5, pathDelayMs)
    }

    element.color = 3
    store.commit('tile', element)

    const neighbors = getNeighbors(element)
    for (const n of neighbors) add(n, element)
  }
}

export default {
  run,
}


