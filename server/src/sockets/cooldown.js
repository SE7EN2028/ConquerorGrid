const lastClaim = new Map();

export function checkCooldown(userId, ms) {
  const elapsed = Date.now() - (lastClaim.get(userId) || 0);
  if (elapsed < ms) return { ok: false, retryIn: ms - elapsed };
  return { ok: true };
}

export function markClaim(userId) {
  lastClaim.set(userId, Date.now());
}
