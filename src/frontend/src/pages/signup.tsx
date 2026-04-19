import { CyberBackground } from "@/components/cyber-background";
import { GlassCard } from "@/components/glass-card";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.username.trim()) {
    errors.username = "Username is required";
  } else if (data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const {
    signup,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setErrors((prev) => ({ ...prev, global: authError }));
    }
  }, [authError]);

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const updated = { ...form, [field]: value };
        const errs = validate(updated);
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
      }
      if (authError) clearError();
      if (errors.global) setErrors((prev) => ({ ...prev, global: undefined }));
    };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    clearError();
    setErrors({});

    // Brief async delay for UX feel
    await new Promise((res) => setTimeout(res, 600));

    const success = signup(
      form.username.trim(),
      form.email.trim(),
      form.password,
    );
    if (!success) {
      setIsLoading(false);
    }
    // on success, useEffect handles redirect
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Three.js scene */}
      <CyberBackground />

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-[1]" />

      {/* Scanline overlay */}
      <div className="scanline absolute inset-0 pointer-events-none z-[2] opacity-50" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4 py-8"
      >
        <GlassCard glow="purple" className="p-8" data-ocid="signup.card">
          {/* Header */}
          <div className="mb-7 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 rounded-full glassmorphism glow-purple">
                <ShieldCheck
                  className="w-9 h-9 neon-text-cyan"
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            <h1 className="font-display text-2xl font-bold uppercase tracking-widest neon-text-cyan mb-1">
              Create Access
            </h1>
            <p className="text-muted-foreground text-sm font-mono tracking-wide">
              Initialize your CyberGuard account
            </p>
          </div>

          {/* Global error banner */}
          <AnimatePresence>
            {errors.global && (
              <motion.div
                key="global-error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                data-ocid="signup.error_state"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-mono neon-text-red overflow-hidden"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.global}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
            data-ocid="signup.form"
          >
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-username"
                className="block text-xs font-display uppercase tracking-widest text-muted-foreground"
              >
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange("username")}
                onBlur={handleBlur("username")}
                data-ocid="signup.username.input"
                aria-describedby={
                  errors.username ? "signup-username-error" : undefined
                }
                aria-invalid={!!errors.username}
                placeholder="agent_zero"
                className="w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
              />
              {touched.username && errors.username && (
                <p
                  id="signup-username-error"
                  data-ocid="signup.username.field_error"
                  className="text-xs font-mono neon-text-red flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="block text-xs font-display uppercase tracking-widest text-muted-foreground"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                data-ocid="signup.email.input"
                aria-describedby={
                  errors.email ? "signup-email-error" : undefined
                }
                aria-invalid={!!errors.email}
                placeholder="agent@cyberguard.io"
                className="w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
              />
              {touched.email && errors.email && (
                <p
                  id="signup-email-error"
                  data-ocid="signup.email.field_error"
                  className="text-xs font-mono neon-text-red flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="block text-xs font-display uppercase tracking-widest text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  data-ocid="signup.password.input"
                  aria-describedby={
                    errors.password ? "signup-password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  placeholder="Min. 6 characters"
                  className="w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 pr-11 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  data-ocid="signup.password.toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p
                  id="signup-password-error"
                  data-ocid="signup.password.field_error"
                  className="text-xs font-mono neon-text-red flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-confirm"
                className="block text-xs font-display uppercase tracking-widest text-muted-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  data-ocid="signup.confirm_password.input"
                  aria-describedby={
                    errors.confirmPassword ? "signup-confirm-error" : undefined
                  }
                  aria-invalid={!!errors.confirmPassword}
                  placeholder="Repeat password"
                  className="w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 pr-11 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  data-ocid="signup.confirm_password.toggle"
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded p-0.5"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p
                  id="signup-confirm-error"
                  data-ocid="signup.confirm_password.field_error"
                  className="text-xs font-mono neon-text-red flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              data-ocid="signup.submit_button"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              className="relative w-full mt-2 py-3 rounded-lg font-display uppercase tracking-widest text-sm font-bold text-foreground transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.42 0.22 289 / 0.9), oklch(0.32 0.2 262 / 0.9))",
                boxShadow: isLoading
                  ? "0 0 12px 2px rgba(184,79,255,0.2)"
                  : "0 0 22px 4px rgba(184,79,255,0.45), 0 0 44px 8px rgba(184,79,255,0.15)",
                border: "1px solid rgba(184,79,255,0.55)",
              }}
            >
              {/* Pulse glow ring */}
              {!isLoading && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg animate-[pulse_2.2s_ease-in-out_infinite]"
                  style={{ boxShadow: "inset 0 0 18px rgba(184,79,255,0.18)" }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                      data-ocid="signup.loading_state"
                    />
                    <span>Initializing...</span>
                  </>
                ) : (
                  "Initialize Account"
                )}
              </span>
            </motion.button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm font-mono text-muted-foreground">
            Already have access?{" "}
            <a
              href="/login"
              data-ocid="signup.login.link"
              className="neon-text-cyan hover:opacity-80 transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
              onClick={(e) => {
                e.preventDefault();
                void navigate({ to: "/login" });
              }}
            >
              Login
            </a>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
