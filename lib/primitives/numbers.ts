export default {
  rotateLeft(i: number, distance: number): number {
    return (i << distance) | (i >>> -distance);
  },

  rotateRight(i: number, distance: number): number {
    return (i >>> distance) | (i << -distance);
  }
}