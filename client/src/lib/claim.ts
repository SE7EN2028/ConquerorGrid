import { getSocket } from "./socket";
import type { ClaimResult } from "./types";

export function claimCell(index: number): Promise<ClaimResult> {
  return new Promise((resolve) => {
    getSocket().emit("cell:claim", { index }, (res: ClaimResult) => resolve(res));
  });
}
