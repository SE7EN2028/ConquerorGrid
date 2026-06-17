import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";

const SIZE = 150;

export function Minimap() {
  const cols = useGameStore((s) => s.cols);
  const rows = useGameStore((s) => s.rows);
  const cells = useGameStore((s) => s.cells);
  const view = useGameStore((s) => s.view);
  const setView = useGameStore((s) => s.setView);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cell = cols ? Math.max(2, Math.floor(SIZE / cols)) : 2;
  const width = cols * cell;
  const height = rows * cell;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    g.fillStyle = "#181826";
    g.fillRect(0, 0, width, height);
    for (const key in cells) {
      const c = cells[key];
      if (!c.owner) continue;
      g.fillStyle = c.owner.color;
      g.fillRect(c.col * cell, c.row * cell, cell, cell);
    }
  }, [cells, cell, width, height]);

  // visible window in board fractions, derived from the pan/zoom transform
  const box =
    view.baseW > 0 && view.baseH > 0
      ? {
          left: (-view.tx / view.scale / view.baseW) * 100,
          top: (-view.ty / view.scale / view.baseH) * 100,
          w: (view.vw / view.scale / view.baseW) * 100,
          h: (view.vh / view.scale / view.baseH) * 100,
        }
      : null;

  const recenter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    setView({
      tx: view.vw / 2 - fx * view.baseW * view.scale,
      ty: view.vh / 2 - fy * view.baseH * view.scale,
    });
  };

  return (
    <div
      onClick={recenter}
      className="absolute bottom-3 left-3 cursor-pointer overflow-hidden rounded-md border border-border bg-surface/80 backdrop-blur"
      style={{ width, height }}
    >
      <canvas ref={canvasRef} width={width} height={height} />
      {box && (
        <div
          className="pointer-events-none absolute border border-white/80"
          style={{
            left: `${Math.max(0, box.left)}%`,
            top: `${Math.max(0, box.top)}%`,
            width: `${Math.min(100, box.w)}%`,
            height: `${Math.min(100, box.h)}%`,
          }}
        />
      )}
    </div>
  );
}
