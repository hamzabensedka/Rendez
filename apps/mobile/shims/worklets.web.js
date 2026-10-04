export function createSerializable(value) {
  return value;
}

export function scheduleOnUI(fn, ...args) {
  if (typeof fn === 'function') {
    fn(...args);
  }
}

export function runOnUI(fn) {
  return fn;
}

export function runOnJS(fn) {
  return fn;
}
