function unionArrays(arr1, arr2) {
  const map = new Map();

  arr1.forEach(obj => {
    if (!map.has(obj._id)) {
      map.set(obj._id, obj);
    }
  });

  arr2.forEach(obj => {
    if (!map.has(obj._id)) {
      map.set(obj._id, obj);
    }
  });

  return Array.from(map.values());
}

export default unionArrays;