// Convert a cell edge into two grid node endpoints in the (m+1) x (n+1) lattice
export function getEdgeEndpoints(edge) {
  const { x, y, side } = edge
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
export function payloadForEdgeBetweenNodes(a, b) {
  if (a.x === b.x && Math.abs(a.y - b.y) === 1) {
    const x = a.x
    const yMin = Math.min(a.y, b.y)
    if (x === 0) {
      return { x: 0, y: yMin, side: 'left' }
    } else {
      return { x: x - 1, y: yMin, side: 'right' }
    }
  }
  if (a.y === b.y && Math.abs(a.x - b.x) === 1) {
    const y = a.y
    const xMin = Math.min(a.x, b.x)
    if (y === 0) {
      return { x: xMin, y: 0, side: 'top' }
    } else {
      return { x: xMin, y: y - 1, side: 'bottom' }
    }
  }
  throw new Error('Nodes must be adjacent to map to an edge')
}


