let assemblePending = false;

export function requestAssemble() {
  assemblePending = true;
}

export function consumeAssemble() {
  const pending = assemblePending;
  assemblePending = false;
  return pending;
}
