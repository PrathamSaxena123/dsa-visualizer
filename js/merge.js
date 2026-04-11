/* ============================================
   MERGE SORT — js/merge.js
   Generates step-by-step animation frames
============================================ */

/**
 * Merge Sort animation generator.
 * We use a bottom-up iterative approach to
 * keep tracking of array indices clean.
 */
function getMergeSortAnimations(arr) {
  const animations = [];
  const array = [...arr];
  const helper = [...arr]; // auxiliary array
  mergeSortHelper(array, helper, 0, array.length - 1, animations);
  return animations;
}

function mergeSortHelper(mainArray, helperArray, start, end, animations) {
  if (start === end) return;

  const mid = Math.floor((start + end) / 2);

  // Sort left and right halves using helperArray as main, mainArray as helper
  mergeSortHelper(helperArray, mainArray, start, mid, animations);
  mergeSortHelper(helperArray, mainArray, mid + 1, end, animations);

  // Merge back into mainArray
  doMerge(mainArray, helperArray, start, mid, end, animations);
}

function doMerge(mainArray, helperArray, start, mid, end, animations) {
  let k = start;
  let i = start;
  let j = mid + 1;

  while (i <= mid && j <= end) {
    // Comparing helperArray[i] and helperArray[j]
    animations.push({
      type: 'compare',
      indices: [i, j],
      values: null
    });

    animations.push({
      type: 'revert',
      indices: [i, j],
      values: null
    });

    if (helperArray[i] <= helperArray[j]) {
      // We place helperArray[i] at mainArray[k]
      animations.push({
        type: 'mergeplace',
        indices: [k],
        values: [helperArray[i]]
      });
      mainArray[k++] = helperArray[i++];
    } else {
      animations.push({
        type: 'mergeplace',
        indices: [k],
        values: [helperArray[j]]
      });
      mainArray[k++] = helperArray[j++];
    }
  }

  while (i <= mid) {
    animations.push({
      type: 'compare',
      indices: [i, i],
      values: null
    });
    animations.push({
      type: 'revert',
      indices: [i, i],
      values: null
    });
    animations.push({
      type: 'mergeplace',
      indices: [k],
      values: [helperArray[i]]
    });
    mainArray[k++] = helperArray[i++];
  }

  while (j <= end) {
    animations.push({
      type: 'compare',
      indices: [j, j],
      values: null
    });
    animations.push({
      type: 'revert',
      indices: [j, j],
      values: null
    });
    animations.push({
      type: 'mergeplace',
      indices: [k],
      values: [helperArray[j]]
    });
    mainArray[k++] = helperArray[j++];
  }

  // Mark entire merged section as sorted
  for (let x = start; x <= end; x++) {
    animations.push({
      type: 'sorted',
      indices: [x],
      values: null
    });
  }
}