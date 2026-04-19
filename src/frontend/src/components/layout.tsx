import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Shield, Terminal } from "lucide-react";
import { CyberBackground } from "./cyber-background";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = false }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Deep dark grid floor */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none -z-10" />
      {/* Three.js canvas */}
      <CyberBackground />

      {/* Navigation */}
      {showNav && (
        <header className="relative z-20 glassmorphism border-b border-cyan-500/20 glow-cyan">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 group"
              data-ocid="nav.logo_link"
            >
              <div className="relative">
                <Shield className="w-7 h-7 neon-text-cyan transition-smooth group-hover:scale-110" />
                <div className="absolute inset-0 animate-pulse-glow rounded-full opacity-50" />
              </div>
              <span className="font-display text-lg font-bold neon-text-cyan tracking-widest uppercase">
                CyberGuard
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              {isAuthenticated && user && (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="neon-text-cyan opacity-80">
                      {user.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    data-ocid="nav.logout_button"
                    className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-mono text-xs transition-smooth border border-transparent hover:border-red-500/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">LOGOUT</span>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-cyan-500/10 py-4 px-6 bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 neon-text-cyan" />
            <span>
              © {new Date().getFullYear()} CyberGuard — Threat Intelligence
              Platform
            </span>
          </div>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:neon-text-cyan transition-smooth"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
