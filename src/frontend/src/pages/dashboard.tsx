import { CyberBackground } from "@/components/cyber-background";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { useIPCheck } from "@/hooks/use-ip-check";
import { useAuthStore } from "@/store/auth-store";
import type { CheckResult } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  Clock,
  FileWarning,
  Globe,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Particle Burst Canvas ─────────────────────────────────────────────────────
function ParticleBurst({
  active,
  malicious,
}: {
  active: boolean;
  malicious: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const color = malicious ? "255,64,64" : "0,255,136";

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 2 + Math.random() * 3,
      };
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09;
        p.life -= 0.016;
        if (p.life <= 0) continue;
        alive = true;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.life})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${color},0.8)`;
        ctx.fill();
      }
      if (alive) {
        animRef.current = requestAnimationFrame(tick);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, malicious]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
}

// ─── Scanning Pulse ────────────────────────────────────────────────────────────
function ScanningAnimation({ ip }: { ip: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-cyan-400/40 animate-ping [animation-delay:0.25s]" />
        <div className="absolute inset-6 rounded-full border border-cyan-300/60 animate-ping [animation-delay:0.5s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_6px_rgba(0,212,255,0.7)] animate-pulse" />
        </div>
      </div>
      <div>
        <p className="neon-text-cyan font-mono text-sm tracking-widest text-center animate-pulse mb-1">
          SCANNING TARGET
        </p>
        <p className="font-mono text-xs text-center text-muted-foreground tracking-wider">
          {ip}
        </p>
      </div>
      <div className="flex gap-1 items-end h-6">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="w-1 rounded-sm bg-cyan-500/60 animate-pulse"
            style={{
              height: `${8 + Math.abs(3 - i) * 4}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Detail Row ────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  valueClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono uppercase tracking-widest">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      {value && (
        <p
          className={`font-mono text-sm font-semibold text-foreground break-words ${valueClass ?? ""}`}
        >
          {value}
        </p>
      )}
      {children}
    </div>
  );
}

// ─── 3D Flip Result Card ───────────────────────────────────────────────────────
function FlipResultCard({
  isFlipped,
  malicious,
  ip,
  front,
  back,
}: {
  isFlipped: boolean;
  malicious: boolean;
  ip: string;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const glowClass = malicious
    ? "glow-red border-red-500/30"
    : "glow-green border-green-500/30";

  return (
    <div style={{ perspective: "1400px" }} className="w-full">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
        data-ocid={`dashboard.result_flip.${ip}`}
      >
        {/* Front face */}
        <div style={{ backfaceVisibility: "hidden" }} className="w-full">
          <div
            className={`glassmorphism rounded-xl border overflow-hidden relative ${glowClass}`}
          >
            <div className="scanline absolute inset-0 pointer-events-none z-0 opacity-25" />
            <div className="relative z-10">{front}</div>
          </div>
        </div>

        {/* Back face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
        >
          <div
            className={`glassmorphism rounded-xl border overflow-hidden relative ${glowClass}`}
          >
            <div className="scanline absolute inset-0 pointer-events-none z-0 opacity-25" />
            <div className="relative z-10">{back}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Recent Scan Row ───────────────────────────────────────────────────────────
function RecentScanRow({ scan, index }: { scan: CheckResult; index: number }) {
  const isMalicious = scan.status === "malicious";
  const timeStr = new Date(scan.checkedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      data-ocid={`recent-scans.item.${index + 1}`}
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-smooth"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
            isMalicious
              ? "bg-red-400 shadow-[0_0_6px_2px_rgba(255,64,64,0.7)]"
              : "bg-green-400 shadow-[0_0_6px_2px_rgba(0,255,136,0.7)]"
          }`}
        />
        <span className="font-mono text-sm text-foreground/80 truncate">
          {scan.ip}
        </span>
        {scan.result && (
          <span className="hidden sm:block font-mono text-xs text-muted-foreground truncate">
            {scan.result.country}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <span
          className={`font-mono text-xs font-semibold tracking-wider ${
            isMalicious ? "neon-text-red" : "neon-text-green"
          }`}
        >
          {isMalicious ? "THREAT" : "CLEAN"}
        </span>
        {scan.result && isMalicious && (
          <span className="hidden sm:block font-mono text-xs text-muted-foreground">
            {scan.result.confidenceScore}%
          </span>
        )}
        <span className="font-mono text-xs text-muted-foreground/60">
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { result, isLoading, error, checkIP, reset } = useIPCheck();

  const [ipInput, setIpInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<CheckResult[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // When result arrives → flip + burst
  useEffect(() => {
    if (result && !isLoading) {
      setRecentScans((prev) => {
        const updated = [result, ...prev.filter((s) => s.ip !== result.ip)];
        return updated.slice(0, 5);
      });
      setTimeout(() => {
        setShowParticles(true);
        setIsFlipped(true);
        setTimeout(() => setShowParticles(false), 2000);
      }, 120);
    }
  }, [result, isLoading]);

  const handleLogout = useCallback(() => {
    logout();
    void navigate({ to: "/login" });
  }, [logout, navigate]);

  const validateAndScan = useCallback(() => {
    const trimmed = ipInput.trim();
    if (!trimmed) {
      setInputError("Enter an IP address");
      return;
    }
    const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const v6 = /^[0-9a-fA-F:]{2,39}$/;
    let valid = false;
    if (v4.test(trimmed)) {
      valid = trimmed.split(".").every((o) => {
        const n = Number.parseInt(o, 10);
        return n >= 0 && n <= 255;
      });
    } else if (v6.test(trimmed)) {
      valid = true;
    }
    if (!valid) {
      setInputError("Invalid IP format (e.g. 1.2.3.4)");
      return;
    }
    setInputError(null);
    setIsFlipped(false);
    reset();
    void checkIP(trimmed);
  }, [ipInput, checkIP, reset]);

  const handleNewScan = useCallback(() => {
    setIsFlipped(false);
    setIpInput("");
    reset();
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [reset]);

  const malicious = result?.status === "malicious";
  const StatusIcon = malicious ? ShieldAlert : ShieldCheck;
  const SAMPLE_IPS = ["185.220.101.1", "8.8.8.8", "1.1.1.1", "192.168.1.1"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background grid-bg">
      {/* 3D scene */}
      <CyberBackground />
      {/* Scanlines */}
      <div className="scanline fixed inset-0 pointer-events-none z-[1] opacity-15" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header ── */}
        <header className="sticky top-0 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-cyan-500/10 bg-black/40 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md border border-cyan-500/40 flex items-center justify-center bg-cyan-500/10 shrink-0">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="font-mono font-bold text-base sm:text-lg tracking-widest neon-text-cyan select-none">
              IP THREAT SCANNER
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_2px_rgba(0,255,136,0.6)]" />
                <span className="font-mono text-xs text-foreground/55 tracking-wider uppercase">
                  {user.username}
                </span>
              </div>
            )}
            <button
              data-ocid="dashboard.logout_button"
              type="button"
              onClick={handleLogout}
              className="font-mono text-xs tracking-widest px-3 sm:px-4 py-1.5 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400/60 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12 gap-6">
          {/* Scanner Input Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <GlassCard glow="cyan" data-ocid="dashboard.scanner_card">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">
                    Threat Intelligence Analysis
                  </p>
                  <h2 className="font-mono font-bold text-xl sm:text-2xl neon-text-cyan tracking-wider">
                    IP ADDRESS SCANNER
                  </h2>
                </div>

                {/* Input + Button */}
                <div className="flex gap-2 sm:gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <input
                      ref={inputRef}
                      data-ocid="dashboard.ip_input"
                      type="text"
                      value={ipInput}
                      onChange={(e) => {
                        setIpInput(e.target.value);
                        if (inputError) setInputError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") validateAndScan();
                      }}
                      placeholder="192.168.1.1"
                      spellCheck={false}
                      autoComplete="off"
                      disabled={isLoading}
                      className="w-full font-mono text-base sm:text-lg bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground/40 neon-border-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-smooth disabled:opacity-50"
                      aria-label="IP address to scan"
                    />
                  </div>
                  <button
                    data-ocid="dashboard.scan_button"
                    type="button"
                    onClick={validateAndScan}
                    disabled={isLoading}
                    className="font-mono font-bold tracking-widest px-5 sm:px-7 py-3 rounded-lg bg-cyan-500/10 border border-cyan-400/50 neon-text-cyan hover:bg-cyan-500/20 hover:border-cyan-300/70 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-[0_0_20px_0px_rgba(0,212,255,0.2)]"
                  >
                    {isLoading ? "SCANNING" : "SCAN IP"}
                  </button>
                </div>

                {/* Input validation error */}
                <AnimatePresence>
                  {(inputError ?? error) && (
                    <motion.p
                      data-ocid="dashboard.ip_input.field_error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-xs neon-text-red mt-2 tracking-wider"
                    >
                      ⚠ {inputError ?? error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Sample IPs */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest">
                    Quick test:
                  </span>
                  {SAMPLE_IPS.map((ip, i) => (
                    <button
                      key={ip}
                      type="button"
                      data-ocid={`dashboard.sample_ip.${i + 1}`}
                      onClick={() => {
                        setIpInput(ip);
                        setInputError(null);
                        reset();
                        setIsFlipped(false);
                      }}
                      className="font-mono text-xs px-2.5 py-1 rounded border border-border/40 bg-card/30 text-muted-foreground hover:neon-text-cyan hover:border-cyan-500/40 transition-smooth"
                    >
                      {ip}
                    </button>
                  ))}
                </div>

                {/* Scanning animation */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      data-ocid="dashboard.scan_loading_state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ScanningAnimation ip={ipInput} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Result Flip Card ── */}
          <AnimatePresence>
            {result && !isLoading && (
              <motion.div
                key={`result-${result.ip}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl relative"
                data-ocid="dashboard.result_card"
              >
                <ParticleBurst active={showParticles} malicious={malicious} />

                <FlipResultCard
                  isFlipped={isFlipped}
                  malicious={malicious}
                  ip={result.ip}
                  front={
                    <div className="p-6 sm:p-8 flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <p className="font-mono text-sm text-muted-foreground tracking-widest">
                        PROCESSING RESULT...
                      </p>
                    </div>
                  }
                  back={
                    <div className="p-6 sm:p-8">
                      {/* Status badge */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <StatusIcon
                              className={`w-10 h-10 ${malicious ? "neon-text-red" : "neon-text-green"}`}
                            />
                            <span
                              className={`absolute inset-0 rounded-full animate-pulse opacity-30 ${
                                malicious ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-mono font-black text-2xl tracking-widest ${
                                malicious ? "neon-text-red" : "neon-text-green"
                              }`}
                            >
                              {malicious ? "THREAT DETECTED" : "IP CLEAN"}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground tracking-wider mt-0.5">
                              TARGET: {result.ip}
                            </p>
                          </div>
                        </div>
                        {result.result && malicious && (
                          <div className="text-right shrink-0">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                              Confidence
                            </p>
                            <p className="font-mono font-black text-3xl neon-text-red">
                              {result.result.confidenceScore}%
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      {result.result && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6"
                        >
                          <InfoRow
                            icon={Globe}
                            label="Country"
                            value={result.result.country}
                          />
                          <InfoRow
                            icon={Building2}
                            label="ISP / Organization"
                            value={result.result.isp}
                          />
                          <InfoRow
                            icon={Tag}
                            label="Usage Type"
                            value={result.result.usageType}
                          />
                          <InfoRow
                            icon={BarChart3}
                            label="Total Reports"
                            value={String(result.result.totalReports)}
                            valueClass={
                              result.result.totalReports > 0
                                ? "neon-text-red"
                                : "neon-text-green"
                            }
                          />
                          <InfoRow
                            icon={Clock}
                            label="Last Reported"
                            value={
                              result.result.lastReportedAt === "Never"
                                ? "Never"
                                : new Date(
                                    result.result.lastReportedAt,
                                  ).toLocaleString()
                            }
                          />
                          <InfoRow icon={FileWarning} label="Threat Types">
                            {result.result.threatTypes.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.result.threatTypes.map((t) => (
                                  <Badge
                                    key={t}
                                    variant="outline"
                                    className="font-mono text-xs neon-text-red border-red-500/40 bg-red-500/10"
                                  >
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="font-mono text-sm font-semibold neon-text-green">
                                None detected
                              </p>
                            )}
                          </InfoRow>
                        </motion.div>
                      )}

                      {/* New scan */}
                      <div className="mt-6 flex justify-end">
                        <button
                          data-ocid="dashboard.new_scan_button"
                          type="button"
                          onClick={handleNewScan}
                          className="flex items-center gap-1.5 font-mono text-xs tracking-widest px-4 py-2 rounded border border-cyan-500/30 text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-300 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                        >
                          <RotateCcw className="w-3 h-3" />
                          NEW SCAN
                        </button>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty state ── */}
          {!result && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              data-ocid="dashboard.empty_state"
              className="w-full max-w-2xl"
            >
              <GlassCard glow="purple" className="p-8 sm:p-12 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 neon-text-purple opacity-40" />
                <p className="font-mono font-bold text-base text-muted-foreground tracking-widest uppercase mb-2">
                  Awaiting Target
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  Enter an IPv4 or IPv6 address above to begin
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* ── Recent Scans ── */}
          <AnimatePresence>
            {recentScans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
              >
                <GlassCard glow="purple" data-ocid="dashboard.recent_scans">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1 h-4 rounded-sm bg-purple-400 shadow-[0_0_6px_2px_rgba(184,79,255,0.6)]" />
                      <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        Recent Scans
                      </h3>
                      <span className="ml-auto font-mono text-xs text-muted-foreground/40">
                        Last {recentScans.length}
                      </span>
                    </div>
                    <div className="space-y-1.5" data-ocid="recent-scans.list">
                      {recentScans.map((scan, i) => (
                        <RecentScanRow key={scan.ip} scan={scan} index={i} />
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Footer ── */}
        <footer className="text-center py-4 border-t border-cyan-500/10 bg-black/20 backdrop-blur-sm">
          <p className="font-mono text-xs text-muted-foreground/35 tracking-wider">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400/60 transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
