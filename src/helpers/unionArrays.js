/**
 * Merges two arrays of comment objects with unique _id values
 * Also updates objects with the same _id by keeping the most recent values
 * @param {Array} arr1 - First array of comment objects
 * @param {Array} arr2 - Second array of comment objects
 * @returns {Array} - Combined array with unique objects
 */
function unionArrays(arr1, arr2) {
  const map = new Map();

  // Add all items from the first array
  arr1.forEach((obj) => {
    if (!map.has(obj._id)) {
      map.set(obj._id, obj);
    }
  });

  // Add items from the second array, or update if they exist
  arr2.forEach((obj) => {
    // If object with this ID already exists, we need to compare and possibly merge
    if (map.has(obj._id)) {
      const existingObj = map.get(obj._id);
      // Keep the object with valid left/right values if they exist
      if (obj.left && obj.right && (!existingObj.left || !existingObj.right)) {
        map.set(obj._id, obj);
      }
      // If both have left/right values, keep the newer one (assuming createdAt is a timestamp)
      else if (obj.left && obj.right && existingObj.left && existingObj.right) {
        const objDate = new Date(obj.createdAt);
        const existingDate = new Date(existingObj.createdAt);

        if (objDate > existingDate) {
          map.set(obj._id, obj);
        }
      }
    } else {
      // Simply add the new object if it doesn't exist
      map.set(obj._id, obj);
    }
  });

  // Convert to array and sort by left value (for proper comment ordering)
  const result = Array.from(map.values());

  return result;
}

export default unionArrays;
