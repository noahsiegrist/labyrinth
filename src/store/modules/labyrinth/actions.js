import { getEdgeEndpoints, payloadForEdgeBetweenNodes } from './helpers'

const actions = {
  init({ state }) {
    const matrix = []
    for (let i = 0; i < state.n; i++) {
      const row = []
      for (let j = 0; j < state.m; j++) {
        row.push({
          y: i,
          x: j,
          top: i === 0,
          right: j + 1 === state.m,
          bottom: i + 1 === state.n,
          left: j === 0,
          color: 0,
          parent: null,
        })
      }
      matrix.push(row)
    }
    state.matrix = matrix
  },

  reset({ commit }) {
    commit('resetMatrix')
  },

  connectToLastAndSet({ state, commit }, payload) {
    const newEdge = { x: payload.x, y: payload.y, side: payload.side }
    commit('setWall', newEdge)

    const last = state.lastDrawEdge
    if (!last) {
      commit('setLastDrawEdge', newEdge)
      return
    }

    const lastEndpoints = getEdgeEndpoints(last)
    const newEndpoints = getEdgeEndpoints(newEdge)

    let best = { a: lastEndpoints[0], b: newEndpoints[0], d: Infinity }
    for (const a of lastEndpoints) {
      for (const b of newEndpoints) {
        const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
        if (d < best.d) best = { a, b, d }
      }
    }

    let cx = best.a.x
    let cy = best.a.y
    while (cx !== best.b.x) {
      const stepX = best.b.x > cx ? 1 : -1
      const next = { x: cx + stepX, y: cy }
      const edgePayload = payloadForEdgeBetweenNodes({ x: cx, y: cy }, next)
      commit('setWall', edgePayload)
      cx = next.x
    }
    while (cy !== best.b.y) {
      const stepY = best.b.y > cy ? 1 : -1
      const next = { x: cx, y: cy + stepY }
      const edgePayload = payloadForEdgeBetweenNodes({ x: cx, y: cy }, next)
      commit('setWall', edgePayload)
      cy = next.y
    }

    commit('setLastDrawEdge', newEdge)
  },

  generateMaze({ state, commit }) {
    const height = state.n
    const width = state.m

    const matrix = []
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        row.push({
          y,
          x,
          top: false,
          right: false,
          bottom: false,
          left: false,
          color: 0,
          parent: null,
        })
      }
      matrix.push(row)
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = matrix[y][x]
        if (x === 0) cell.left = true
        if (y === 0) cell.top = true
        if (x === width - 1) cell.right = true
        if (y === height - 1) cell.bottom = true
        if (x < width - 1) {
          cell.right = true
          const rightNeighbour = matrix[y][x + 1]
          rightNeighbour.left = true
        }
        if (y < height - 1) {
          cell.bottom = true
          const bottomNeighbour = matrix[y + 1][x]
          bottomNeighbour.top = true
        }
      }
    }

    function removeWall(ax, ay, bx, by) {
      if (ax === bx) {
        if (by === ay + 1) {
          matrix[ay][ax].bottom = false
          matrix[by][bx].top = false
        } else if (by === ay - 1) {
          matrix[ay][ax].top = false
          matrix[by][bx].bottom = false
        }
      } else if (ay === by) {
        if (bx === ax + 1) {
          matrix[ay][ax].right = false
          matrix[by][bx].left = false
        } else if (bx === ax - 1) {
          matrix[ay][ax].left = false
          matrix[by][bx].right = false
        }
      }
    }

    const visited = Array.from({ length: height }, () => Array(width).fill(false))
    const stack = []
    const startY = Math.floor(Math.random() * height)
    const startX = Math.floor(Math.random() * width)
    stack.push({ x: startX, y: startY })
    visited[startY][startX] = true

    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      const { x, y } = current

      const neighbors = []
      if (x > 0 && !visited[y][x - 1]) neighbors.push({ x: x - 1, y })
      if (x < width - 1 && !visited[y][x + 1]) neighbors.push({ x: x + 1, y })
      if (y > 0 && !visited[y - 1][x]) neighbors.push({ x, y: y - 1 })
      if (y < height - 1 && !visited[y + 1][x]) neighbors.push({ x, y: y + 1 })

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]
        removeWall(x, y, next.x, next.y)
        visited[next.y][next.x] = true
        stack.push(next)
      } else {
        stack.pop()
      }
    }

    matrix[0][0].top = false
    matrix[height - 1][width - 1].bottom = false
    commit('setMatrix', matrix)
  },
}

export default actions


