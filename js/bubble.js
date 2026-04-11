/* ============================================
   BUBBLE SORT — js/bubble.js
   Generates step-by-step animation frames
============================================ */

/**
 * Bubble Sort generates an array of "frames"
 * Each frame describes which bars are being
 * compared, swapped, or marked as sorted.
 *
 * Returns: Array of frame objects
 */
function getBubbleSortAnimations(arr) {
  const animations = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {

      // FRAME: Mark these two bars as "comparing"
      animations.push({
        type: 'compare',
        indices: [j, j + 1],
        values: null
      });

      if (array[j] > array[j + 1]) {
        // Swap in our working array
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        // FRAME: Show the swap with new heights
        animations.push({
          type: 'swap',
          indices: [j, j + 1],
          values: [array[j], array[j + 1]]
        });
      }

      // FRAME: Remove highlight from these two
      animations.push({
        type: 'revert',
        indices: [j, j + 1],
        values: null
      });
    }

    // FRAME: Mark the last element in this pass as sorted
    animations.push({
      type: 'sorted',
      indices: [n - 1 - i],
      values: null
    });
  }

  // Mark the first element as sorted (last remaining)
  animations.push({
    type: 'sorted',
    indices: [0],
    values: null
  });

  return animations;
}