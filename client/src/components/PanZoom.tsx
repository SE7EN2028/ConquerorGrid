import { useEffect, useRef, type ReactNode, type PointerEvent, type WheelEvent } from "react";
import { Plus, Minus, Maximize } from "lucide-react";
import { useGameStore } from "../store/gameStore";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function clampPan(t: number, viewport: number, content: number, scale: number) {
  const scaled = content * scale;
  if (scaled <= viewport) return (viewport - scaled) / 2;
  return clamp(t, viewport - scaled, 0);
}

export function PanZoom({ children }: { children: ReactNode }) {
  const setView = useGameStore((s) => s.setView);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const inner = contentRef.current;
      if (!c || !inner) return;
      setView({
        vw: c.clientWidth,
        vh: c.clientHeight,
        baseW: inner.offsetWidth,
        baseH: inner.offsetHeight,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [setView]);

  const apply = (scale: number, tx: number, ty: number) => {
    const { vw, vh, baseW, baseH } = useGameStore.getState().view;
    setView({
      scale,
      tx: clampPan(tx, vw, baseW, scale),
      ty: clampPan(ty, vh, baseH, scale),
    });
  };

  const zoomAround = (px: number, py: number, factor: number) => {
    const view = useGameStore.getState().view;
    const next = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
    const cx = (px - view.tx) / view.scale;
    const cy = (py - view.ty) / view.scale;
    apply(next, px - cx * next, py - cy * next);
  };

  const onWheel = (e: WheelEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    zoomAround(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  };

  const zoomButton = (factor: number) => {
    const view = useGameStore.getState().view;
    zoomAround(view.vw / 2, view.vh / 2, factor);
  };

  const reset = () => apply(1, 0, 0);

  const onPointerDown = (e: PointerEvent) => {
    const view = useGameStore.getState().view;
    drag.current = { active: true, moved: false, startX: e.clientX, startY: e.clientY, tx: view.tx, ty: view.ty };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    const { scale } = useGameStore.getState().view;
    apply(scale, drag.current.tx + dx, drag.current.ty + dy);
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  // a drag should never register as a claim click on a cell
  const onClickCapture = (e: { stopPropagation: () => void }) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      e.stopPropagation();
    }
  };

  const view = useGameStore((s) => s.view);

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
      className="relative h-[62vh] w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing"
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <ZoomButton onClick={() => zoomButton(1.3)}>
          <Plus size={16} />
        </ZoomButton>
        <ZoomButton onClick={() => zoomButton(1 / 1.3)}>
          <Minus size={16} />
        </ZoomButton>
        <ZoomButton onClick={reset}>
          <Maximize size={15} />
        </ZoomButton>
      </div>
    </div>
  );
}

function ZoomButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface/80 text-muted backdrop-blur transition hover:text-text"
    >
      {children}
    </button>
  );
}
