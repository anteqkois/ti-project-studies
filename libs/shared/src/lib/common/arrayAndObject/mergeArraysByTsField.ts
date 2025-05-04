export const mergeSortedArrays = <T extends { ts: number }>(
  initialArray: T[],
  toMergeArray: T[]
): T[] => {
  let i = 0,
    j = 0;
  const result: T[] = [];

  while (i < initialArray.length && j < toMergeArray.length) {
    if (initialArray[i].ts < toMergeArray[j].ts) {
      result.push(initialArray[i++]);
    } else if (initialArray[i].ts > toMergeArray[j].ts) {
      result.push(toMergeArray[j++]);
    } else {
      result.push(toMergeArray[j++]); // Replace duplicate
      i++;
    }
  }

  while (i < initialArray.length) result.push(initialArray[i++]);
  while (j < toMergeArray.length) result.push(toMergeArray[j++]);

  return result;
};
