import { cn } from "@/lib/utils";
import type { GlowColor } from "@/types";

const glowClasses: Record<GlowColor, string> = {
  cyan: "glow-cyan border-cyan-500/30",
  green: "glow-green border-green-500/30",
  red: "glow-red border-red-500/30",
  purple: "glow-purple border-purple-500/30",
};

const hoverGlowClasses: Record<GlowColor, string> = {
  cyan: "hover:shadow-glow-lg hover:border-cyan-400/50",
  green:
    "hover:shadow-[0_0_30px_4px_rgba(0,255,136,0.5)] hover:border-green-400/50",
  red: "hover:shadow-[0_0_30px_4px_rgba(255,64,64,0.5)] hover:border-red-400/50",
  purple:
    "hover:shadow-[0_0_30px_4px_rgba(184,79,255,0.5)] hover:border-purple-400/50",
};

interface GlassCardProps {
  children: React.ReactNode;
  glow?: GlowColor;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  animate?: boolean;
  "data-ocid"?: string;
  role?: string;
  tabIndex?: number;
}

export function GlassCard({
  children,
  glow = "cyan",
  className,
  onClick,
  onKeyDown,
  animate = false,
  "data-ocid": dataOcid,
  role,
  tabIndex,
}: GlassCardProps) {
  const handleKeyDown =
    onKeyDown ??
    ((e: React.KeyboardEvent) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    });

  return (
    <div
      data-ocid={dataOcid}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={role ?? (onClick ? "button" : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      className={cn(
        "glassmorphism rounded-xl border transition-smooth relative overflow-hidden",
        glowClasses[glow],
        hoverGlowClasses[glow],
        animate && "animate-float-in",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 pointer-events-none z-0 opacity-30" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
