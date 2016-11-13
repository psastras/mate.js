/**
 * Helper functions to operate on `number` types.
 */

export default {
  
  /**
   * Returns the value obtained by rotating the two's complement binary representation
   * of the specified int value left by the specified number of bits.
   * @param i The number to rotate
   * @param distance The number of bits to rotate
   */
  rotateLeft(i: number, distance: number): number {
    return (i << distance) | (i >>> -distance);
  },

  /**
   * Returns the value obtained by rotating the two's complement binary representation
   * of the specified int value right by the specified number of bits.
   * @param i The number to rotate
   * @param distance The number of bits to rotate
   */
  rotateRight(i: number, distance: number): number {
    return (i >>> distance) | (i << -distance);
  }
}