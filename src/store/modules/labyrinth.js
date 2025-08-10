const state = {
    n: 31,
    m: 31,
    matrix: [],
    start: {y: 0, x: 0},
    end: {y: 30, x: 30},
    lastDrawEdge: null,
};

const getters = {
    matrix: state => state.matrix,
    start: state => {
        if(state.matrix.length === 0){
            actions.init({state})
        }
        return {...state.matrix[state.start.y][state.start.x]}},
    end: state =>  { return {...state.matrix[state.end.y][state.end.x]}},
};

// Convert a cell edge into two grid node endpoints in the (m+1) x (n+1) lattice
function getEdgeEndpoints(edge) {
    const { x, y, side } = edge;
    switch (side) {
        case 'right':
            return [
                { x: x + 1, y },
                { x: x + 1, y: y + 1 },
            ]
        case 'bottom':
            return [
                { x, y: y + 1 },
                { x: x + 1, y: y + 1 },
            ]
        case 'left':
            return [
                { x, y },
                { x, y: y + 1 },
            ]
        case 'top':
            return [
                { x, y },
                { x: x + 1, y },
            ]
    }
    return []
}

// Map an adjacent pair of grid nodes back to a cell edge payload
function payloadForEdgeBetweenNodes(a, b) {
    if (a.x === b.x && Math.abs(a.y - b.y) === 1) {
        // vertical edge
        const x = a.x;
        const yMin = Math.min(a.y, b.y);
        if (x === 0) {
            return { x: 0, y: yMin, side: 'left' };
        } else {
            return { x: x - 1, y: yMin, side: 'right' };
        }
    }
    if (a.y === b.y && Math.abs(a.x - b.x) === 1) {
        // horizontal edge
        const y = a.y;
        const xMin = Math.min(a.x, b.x);
        if (y === 0) {
            return { x: xMin, y: 0, side: 'top' };
        } else {
            return { x: xMin, y: y - 1, side: 'bottom' };
        }
    }
    throw new Error('Nodes must be adjacent to map to an edge');
}

const actions = {
    init({state}) {
        let matrix = []
        for (let i = 0; i < state.n; i++) {
            let row = [];
            for (let j = 0; j < state.m; j++) {
                row.push({
                    y: i,
                    x: j,
                    top: i === 0,
                    right: j + 1 === state.m,
                    bottom: i + 1 === state.n,
                    left: j === 0,
                    color: 0,
                    parent: null
                })
            }
            matrix.push(row)
        }

        return state.matrix = matrix
    },
    reset({ commit }) {
        commit('resetMatrix')
    },

    // Draw the new edge and connect it with the shortest Manhattan path to the last Shift-drawn edge
    connectToLastAndSet({ state, commit }, payload) {
        const newEdge = { x: payload.x, y: payload.y, side: payload.side };
        // Place the chosen edge itself
        commit('setWall', newEdge)

        const last = state.lastDrawEdge;
        if (!last) {
            commit('setLastDrawEdge', newEdge)
            return;
        }

        const lastEndpoints = getEdgeEndpoints(last);
        const newEndpoints = getEdgeEndpoints(newEdge);

        // Choose endpoint pair minimizing Manhattan distance
        let best = { a: lastEndpoints[0], b: newEndpoints[0], d: Infinity };
        for (const a of lastEndpoints) {
            for (const b of newEndpoints) {
                const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
                if (d < best.d) {
                    best = { a, b, d };
                }
            }
        }

        // Walk horizontally then vertically placing edges along the path
        let cx = best.a.x;
        let cy = best.a.y;
        while (cx !== best.b.x) {
            const stepX = best.b.x > cx ? 1 : -1;
            const next = { x: cx + stepX, y: cy };
            const edgePayload = payloadForEdgeBetweenNodes({ x: cx, y: cy }, next);
            commit('setWall', edgePayload);
            cx = next.x;
        }
        while (cy !== best.b.y) {
            const stepY = best.b.y > cy ? 1 : -1;
            const next = { x: cx, y: cy + stepY };
            const edgePayload = payloadForEdgeBetweenNodes({ x: cx, y: cy }, next);
            commit('setWall', edgePayload);
            cy = next.y;
        }

        commit('setLastDrawEdge', newEdge)
    },

    // Generate a random perfect maze using recursive backtracker (iterative DFS)
    generateMaze({ state, commit }) {
        const height = state.n
        const width = state.m

        // Build a fresh matrix with all walls present
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

        // Set all walls (both sides for interior edges; borders too)
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

        // Helper to remove wall between two adjacent cells
        function removeWall(ax, ay, bx, by) {
            if (ax === bx) {
                if (by === ay + 1) {
                    // b is below a
                    matrix[ay][ax].bottom = false
                    matrix[by][bx].top = false
                } else if (by === ay - 1) {
                    // b is above a
                    matrix[ay][ax].top = false
                    matrix[by][bx].bottom = false
                }
            } else if (ay === by) {
                if (bx === ax + 1) {
                    // b is right of a
                    matrix[ay][ax].right = false
                    matrix[by][bx].left = false
                } else if (bx === ax - 1) {
                    // b is left of a
                    matrix[ay][ax].left = false
                    matrix[by][bx].right = false
                }
            }
        }

        // Iterative DFS (recursive backtracker)
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

        // Open entrance and exit for aesthetics
        matrix[0][0].top = false
        matrix[height - 1][width - 1].bottom = false

        commit('setMatrix', matrix)
    },

};

const mutations = {
    setMatrix: (state, newMatrix) => {
        state.matrix = newMatrix
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
                if (x >= state.matrix[y].length - 1) {
                    break
                }
                original.right = true
                neighbour = { ...state.matrix[y][x + 1], left: true }
                state.matrix[y][x + 1] = neighbour
                break
            case 'bottom':
                if (y >= state.matrix.length - 1) {
                    break
                }
                original.bottom = true
                neighbour = { ...state.matrix[y + 1][x], top: true }
                state.matrix[y + 1][x] = neighbour
                break
            case 'left':
                if (x <= 0) {
                    break
                }
                original.left = true
                neighbour = { ...state.matrix[y][x - 1], right: true }
                state.matrix[y][x - 1] = neighbour
                break
            case 'top':
                if (y <= 0) {
                    break
                }
                original.top = true
                neighbour = { ...state.matrix[y - 1][x], bottom: true }
                state.matrix[y - 1][x] = neighbour
                break
        }
        state.matrix[y][x] = original
        state.matrix = [...state.matrix]
    },
    toggleWall: (state, payload) => {
        const original = {...state.matrix[payload.y][payload.x]}
        let neighbour
        switch (payload.side) {
            case 'right':
                if (payload.x >= state.matrix[payload.y].length - 1) {
                    return;
                }
                original.right = !original.right
                neighbour = {...state.matrix[payload.y][payload.x + 1], left: original.right}
                state.matrix[payload.y][payload.x + 1] = neighbour
                break
            case 'bottom':
                if (payload.y >= state.matrix.length - 1) {
                    return;
                }
                original.bottom = !original.bottom
                neighbour = {...state.matrix[payload.y + 1][payload.x], top: original.bottom}
                state.matrix[payload.y + 1][payload.x] = neighbour
                break
            case 'left':
                if (payload.x > 0) {
                    return;
                }
                original.left = !original.left
                neighbour = {...state.matrix[payload.y][payload.x - 1], right: original.left}
                state.matrix[payload.y][payload.x - 1] = neighbour
                break
            case 'top':
                if (payload.y > 0) {
                    return;
                }
                original.top = !original.top
                neighbour = {...state.matrix[payload.y - 1][payload.x], bottom: original.top}
                state.matrix[payload.y - 1][payload.x] = neighbour
                break
        }
        state.matrix[payload.y][payload.x] = original
        state.matrix = [...state.matrix]
    },
    tile: (state, tile) => {
        state.matrix[tile.y][tile.x] = {...tile}
        state.matrix = [...state.matrix]
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
