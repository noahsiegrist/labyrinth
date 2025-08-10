import store from '@/store'
import Tile from '@/helpers/tile'

function add(stack, element, parent) {
  if (element.color === 0) {
    element.parent = parent
    element.color = 1
    store.commit('tile', element)
    stack.push(element)
  }
}

async function findPath() {
  const stack = []
  add(stack, store.getters.start, null)

  while (stack.length) {
    const element = stack.pop()
    await new Promise(resolve => setTimeout(resolve, 1))

    if (Tile.equals(element, store.getters.end)) {
      return colorPath(element, 5)
    }

    element.color = 3
    store.commit('tile', element)

    const matrix = store.getters.matrix
    const maxY = matrix.length - 1
    const maxX = matrix[element.y].length - 1

    // Push neighbors in an order to bias the DFS direction (right, bottom, left, top)
    if (!element.top && element.y > 0) {
      add(stack, matrix[element.y - 1][element.x], element)
    }
    if (!element.left && element.x > 0) {
      add(stack, matrix[element.y][element.x - 1], element)
    }
    if (!element.bottom && element.y < maxY) {
      add(stack, matrix[element.y + 1][element.x], element)
    }
    if (!element.right && element.x < maxX) {
      add(stack, matrix[element.y][element.x + 1], element)
    }
  }
}

async function colorPath(element, color) {
  while (element) {
    await new Promise(resolve => setTimeout(resolve, 50))
    element.color = color
    store.commit('tile', element)
    element = element.parent
  }
}

export default {
  findPath,
  colorPath,
}


