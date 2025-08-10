const getters = {
  matrix: state => state.matrix,
  start: state => {
    // Fallback lazy init to avoid runtime errors if not initialized yet
    if (state.matrix.length === 0) {
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
    }
    return { ...state.matrix[state.start.y][state.start.x] }
  },
  end: state => {
    return { ...state.matrix[state.end.y][state.end.x] }
  },
}

export default getters


