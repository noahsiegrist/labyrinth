const mutations = {
  setMatrix: (state, newMatrix) => {
    state.matrix = newMatrix
  },
  setLastDrawEdge: (state, payload) => {
    state.lastDrawEdge = payload ? { ...payload } : null
  },
  clearDrawState: (state) => {
    state.lastDrawEdge = null
  },
  setWall: (state, payload) => {
    const { x, y, side } = payload
    const original = { ...state.matrix[y][x] }
    let neighbour
    switch (side) {
      case 'right':
        if (x >= state.matrix[y].length - 1) break
        original.right = true
        neighbour = { ...state.matrix[y][x + 1], left: true }
        state.matrix[y][x + 1] = neighbour
        break
      case 'bottom':
        if (y >= state.matrix.length - 1) break
        original.bottom = true
        neighbour = { ...state.matrix[y + 1][x], top: true }
        state.matrix[y + 1][x] = neighbour
        break
      case 'left':
        if (x <= 0) break
        original.left = true
        neighbour = { ...state.matrix[y][x - 1], right: true }
        state.matrix[y][x - 1] = neighbour
        break
      case 'top':
        if (y <= 0) break
        original.top = true
        neighbour = { ...state.matrix[y - 1][x], bottom: true }
        state.matrix[y - 1][x] = neighbour
        break
    }
    state.matrix[y][x] = original
    state.matrix = [...state.matrix]
  },
  toggleWall: (state, payload) => {
    const original = { ...state.matrix[payload.y][payload.x] }
    let neighbour
    switch (payload.side) {
      case 'right':
        if (payload.x >= state.matrix[payload.y].length - 1) return
        original.right = !original.right
        neighbour = { ...state.matrix[payload.y][payload.x + 1], left: original.right }
        state.matrix[payload.y][payload.x + 1] = neighbour
        break
      case 'bottom':
        if (payload.y >= state.matrix.length - 1) return
        original.bottom = !original.bottom
        neighbour = { ...state.matrix[payload.y + 1][payload.x], top: original.bottom }
        state.matrix[payload.y + 1][payload.x] = neighbour
        break
      case 'left':
        if (payload.x > 0) return
        original.left = !original.left
        neighbour = { ...state.matrix[payload.y][payload.x - 1], right: original.left }
        state.matrix[payload.y][payload.x - 1] = neighbour
        break
      case 'top':
        if (payload.y > 0) return
        original.top = !original.top
        neighbour = { ...state.matrix[payload.y - 1][payload.x], bottom: original.top }
        state.matrix[payload.y - 1][payload.x] = neighbour
        break
    }
    state.matrix[payload.y][payload.x] = original
    state.matrix = [...state.matrix]
  },
  tile: (state, tile) => {
    state.matrix[tile.y][tile.x] = { ...tile }
    state.matrix = [...state.matrix]
  },
  resetMatrix: (state) => {
    for (let i = 0; i < state.n; i++) {
      for (let j = 0; j < state.m; j++) {
        const item = state.matrix[i][j]
        state.matrix[i][j] = { ...item, color: 0, parent: null }
      }
    }
    state.lastDrawEdge = null
    state.matrix = [...state.matrix]
  },
}

export default mutations


