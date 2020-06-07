const state = {
    n: 30,
    m: 30,
    matrix: []
};

const getters = {
    matrix: state => state.matrix
};

const actions = {
    init({state}) {
        var matrix = []
        for (var i = 0; i < state.n; i++) {
            var row = [];
            for (var j = 0; j < state.m; j++) {
                row.push({
                    y: i,
                    x: j,
                    top: i === 0,
                    right: j + 1 === state.m,
                    bottom: i + 1 === state.n,
                    left: j === 0,
                })
            }
            matrix.push(row)
        }

        return state.matrix = matrix
    }
};

const mutations = {
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
