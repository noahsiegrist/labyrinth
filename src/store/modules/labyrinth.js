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
    reset({state}) {
        state.matrix.forEach(row => {
            row.forEach(async item => {
                state.matrix[item.y][item.x] = {...item, color: 0, parent: null}
                await new Promise(resolve => setTimeout(resolve, 1))
            })
        })
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

};

const mutations = {
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
