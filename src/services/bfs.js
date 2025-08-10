import Base from '@/services/pathfinding/base'

function popFrontier(frontier) {
  return frontier.shift()
}
function pushFrontier(frontier, element) {
  frontier.push(element)
}

async function findPath(options = {}) {
  return Base.run({ popFrontier, pushFrontier, ...options })
}

export default { findPath }


