// Tracks which usernames are currently connected so two people can't be in the
// room under the same name. Reference-counted: a single user with multiple tabs
// keeps the name held until the last one disconnects.
const counts = new Map();

const key = (name) => (name || "").trim().toLowerCase();

export function addPresence(name) {
  const k = key(name);
  if (!k) return;
  counts.set(k, (counts.get(k) || 0) + 1);
}

export function removePresence(name) {
  const k = key(name);
  if (!k) return;
  const next = (counts.get(k) || 0) - 1;
  if (next > 0) counts.set(k, next);
  else counts.delete(k);
}

export function isNameOnline(name) {
  const k = key(name);
  return Boolean(k) && counts.has(k);
}
