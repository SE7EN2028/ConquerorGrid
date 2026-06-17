import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

interface Props {
  value: number;
  className?: string;
}

// Tweens the displayed number from its previous value to the new one.
export function CountUp({ value, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);

  useGSAP(
    () => {
      const counter = { n: from.current };
      gsap.to(counter, {
        n: value,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(counter.n).toLocaleString();
        },
        onComplete: () => {
          from.current = value;
        },
      });
    },
    { dependencies: [value] }
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
