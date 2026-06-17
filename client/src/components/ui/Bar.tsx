import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

interface Props {
  percent: number;
  color: string;
  className?: string;
  glow?: boolean;
}

// Animated fill bar. Tweens to the target percent whenever it changes.
export function Bar({ percent, color, className = "", glow = false }: Props) {
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(fill.current, {
        width: `${Math.min(100, Math.max(0, percent))}%`,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { dependencies: [percent] }
  );

  return (
    <div className={`overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div
        ref={fill}
        className="h-full rounded-full"
        style={{
          width: 0,
          backgroundColor: color,
          boxShadow: glow ? `0 0 12px ${color}aa` : undefined,
        }}
      />
    </div>
  );
}
