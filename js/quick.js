/* ============================================
   QUICK SORT — js/quick.js
   Generates step-by-step animation frames
============================================ */

/**
 * Quick Sort animation generator.
 * Uses Lomuto partition scheme for clarity.
 * Pivot is always the last element.
 */
function getQuickSortAnimations(arr) {
  const animations = [];
  const array = [...arr];
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
}

function quickSortHelper(array, low, high, animations) {
  if (low < high) {
    const pivotIndex = partition(array, low, high, animations);

    // Mark pivot as sorted in its final position
    animations.push({
      type: 'sorted',
      indices: [pivotIndex],
      values: null
    });

    quickSortHelper(array, low, pivotIndex - 1, animations);
    quickSortHelper(array, pivotIndex + 1, high, animations);
  } else if (low === high) {
    // Single element — it's sorted
    animations.push({
      type: 'sorted',
      indices: [low],
      values: null
    });
  }
}

function partition(array, low, high, animations) {
  const pivot = array[high];

  // Highlight the pivot element
  animations.push({
    type: 'pivot',
    indices: [high],
    values: null
  });

  let i = low - 1;

  for (let j = low; j < high; j++) {
    // Compare current element with pivot
    animations.push({
      type: 'compare',
      indices: [j, high],
      values: null
    });

    if (array[j] <= pivot) {
      i++;
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];

      animations.push({
        type: 'swap',
        indices: [i, j],
        values: [array[i], array[j]]
      });
    }

    animations.push({
      type: 'revert',
      indices: [j, high],
      values: null
    });
  }

  // Place pivot in correct position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  animations.push({
    type: 'swap',
    indices: [i + 1, high],
    values: [array[i + 1], array[high]]
  });

  // Remove pivot highlight
  animations.push({
    type: 'unpivot',
    indices: [high],
    values: null
  });

  return i + 1;
}