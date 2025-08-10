import store from '@/store'
import Tile from '@/helpers/tile'

function add(queue, element, parent) {
  if (element.color === 0) {
    element.parent = parent
    element.color = 1
    store.commit('tile', element)
    queue.push(element)
  }
}

async function findPath() {
  let queue = []

  let element = store.getters.start
  while (element) {
    await new Promise(resolve => setTimeout(resolve, 1))

    if (Tile.equals(element, store.getters.end)) {
      return colorPath(element, 5)
    }

    element.color = 3
    store.commit('tile', element)

    const matrix = store.getters.matrix
    const maxY = matrix.length - 1
    const maxX = matrix[element.y].length - 1

    if (!element.right && element.x < maxX) {
      add(queue, matrix[element.y][element.x + 1], element)
    }
    if (!element.bottom && element.y < maxY) {
      add(queue, matrix[element.y + 1][element.x], element)
    }
    if (!element.left && element.x > 0) {
      add(queue, matrix[element.y][element.x - 1], element)
    }
    if (!element.top && element.y > 0) {
      add(queue, matrix[element.y - 1][element.x], element)
    }
    element = queue.shift()
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


