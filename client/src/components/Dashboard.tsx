import { useRef } from "react";
import { Map } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { Header } from "./Header";
import { StatsBar } from "./StatsBar";
import { MapControl } from "./MapControl";
import { Grid } from "./Grid";
import { Leaderboard } from "./Leaderboard";
import { ActivityFeed } from "./ActivityFeed";
import { HudFrame } from "./ui/HudFrame";

export function Dashboard() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".reveal", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="min-h-screen text-text">
      <Header />

      <div className="mx-auto grid max-w-[1400px] gap-5 p-5 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <div className="reveal">
            <StatsBar />
          </div>
          <div className="reveal">
            <MapControl />
          </div>

          <HudFrame className="reveal panel flex flex-col">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <span className="label flex items-center gap-2">
                <Map size={14} className="text-accent" /> Battlefield
              </span>
              <span className="hidden text-xs text-muted sm:block">
                click to claim · drag to pan · scroll to zoom
              </span>
            </div>
            <div className="grid-frame p-3">
              <Grid />
            </div>
          </HudFrame>
        </div>

        <aside className="flex max-h-[calc(100vh-6.5rem)] flex-col gap-5 lg:sticky lg:top-[5.5rem]">
          <div className="reveal flex min-h-0 flex-1 flex-col gap-5">
            <Leaderboard />
            <ActivityFeed />
          </div>
        </aside>
      </div>
    </div>
  );
}
