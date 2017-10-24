function isEqual(a, b) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (typeof a === 'object' && typeof b === 'object') {
    return Object.keys(a).every(key => isEqual(a[key], b[key]));
  }
  return a === b;
}

function checkEquality(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((item, i) => checkEquality(item, b[i]));
  }
  return isEqual(a, b);
}

export default {
  toBeDeepEqual() {
    return {
      compare(actual, expected) {
        return {pass: checkEquality(actual, expected)};
      }
    };
  }
};
