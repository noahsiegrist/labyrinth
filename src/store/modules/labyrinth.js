const state = {
    n: 15,
    m: 15,
    matrix: [],
    start: {y: 0, x: 0},
    end: {y: 14, x: 14},
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
            row.forEach(item => state.matrix[item.y][item.x] = {...item, color: 0, parent: null})
        })
    },

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
