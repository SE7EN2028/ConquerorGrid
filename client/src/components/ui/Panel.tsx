import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title?: string;
  icon?: LucideIcon;
  right?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Panel({ title, icon: Icon, right, className = "", bodyClassName = "", children }: Props) {
  return (
    <section className={`panel flex min-h-0 flex-col ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          {title && (
            <span className="label flex items-center gap-2">
              {Icon && <Icon size={14} className="text-accent" />}
              {title}
            </span>
          )}
          {right}
        </header>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
