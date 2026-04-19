import { u as useNavigate, a as useAuthStore, r as reactExports, j as jsxRuntimeExports } from "./index-Cjluslwg.js";
import { C as CyberBackground, m as motion, G as GlassCard, A as AnimatePresence } from "./proxy-Ceh10oOd.js";
const ShieldIcon = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    viewBox: "0 0 40 44",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-10 h-11",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M20 2L4 8v12c0 10.5 6.9 20.3 16 23 9.1-2.7 16-12.5 16-23V8L20 2Z",
          stroke: "currentColor",
          strokeWidth: "2",
          fill: "rgba(0,212,255,0.09)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M14 22l4 4 8-9",
          stroke: "currentColor",
          strokeWidth: "2.5",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    ]
  }
);
function CyberSpinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-block w-4 h-4 border-2 border-cyan-500/25 border-t-cyan-400 rounded-full animate-spin",
      "aria-hidden": "true"
    }
  );
}
function validate(email, password) {
  const e = {};
  if (!email) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "Enter a valid email address";
  if (!password) e.password = "Password is required";
  else if (password.length < 6)
    e.password = "Password must be at least 6 characters";
  return e;
}
function NeonInput({
  id,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id,
        "data-ocid": dataOcid,
        type,
        placeholder,
        value,
        onChange: (e) => onChange(e.target.value),
        onBlur,
        disabled,
        autoComplete: type === "password" ? "current-password" : "email",
        className: [
          "w-full bg-black/40 border rounded-lg px-4 py-3",
          "font-mono text-sm text-foreground placeholder:text-muted-foreground/40",
          "outline-none transition-all duration-200",
          "focus:border-cyan-400/80 focus:shadow-[0_0_0_2px_rgba(0,212,255,0.18),0_0_14px_rgba(0,212,255,0.18)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error ? "border-red-500/60 shadow-[0_0_8px_rgba(255,64,64,0.25)]" : "border-border/60 hover:border-cyan-500/35"
        ].join(" ")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.p,
      {
        "data-ocid": `${dataOcid}.field_error`,
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
        className: "text-xs font-mono neon-text-red pl-1",
        role: "alert",
        children: [
          "⚠ ",
          error
        ]
      }
    ) })
  ] });
}
function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    error: authError,
    clearError,
    isAuthenticated
  } = useAuthStore();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [touched, setTouched] = reactExports.useState({ email: false, password: false });
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [serverError, setServerError] = reactExports.useState(null);
  const mounted = reactExports.useRef(true);
  reactExports.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  reactExports.useEffect(() => {
    if (isAuthenticated) void navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);
  reactExports.useEffect(() => {
    if (authError) {
      setServerError(authError);
      clearError();
    }
  }, [authError, clearError]);
  const fieldErrors = validate(
    touched.email ? email : "",
    touched.password ? password : ""
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);
    const errs = validate(email, password);
    if (errs.email ?? errs.password) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (!mounted.current) return;
    const ok = login(email, password);
    setIsLoading(false);
    if (!ok) setServerError("AUTHENTICATION FAILED — invalid credentials");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex items-center justify-center overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CyberBackground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 grid-bg pointer-events-none opacity-50 z-[1]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 scanline pointer-events-none opacity-20 z-[1]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 pointer-events-none z-[1]",
        style: {
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 28, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        className: "relative z-10 w-full max-w-md mx-4",
        "data-ocid": "login.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-cyan-400/60 rounded-tl pointer-events-none z-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-cyan-400/60 rounded-tr pointer-events-none z-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-cyan-400/60 rounded-bl pointer-events-none z-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-cyan-400/60 rounded-br pointer-events-none z-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { glow: "cyan", className: "p-8 md:p-10", "data-ocid": "login.card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2.5 mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0.5, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { delay: 0.18, duration: 0.4, ease: "backOut" },
                  className: "neon-text-cyan drop-shadow-[0_0_12px_rgba(0,212,255,0.9)]",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldIcon, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.28, duration: 0.4 },
                  className: "text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-[0.2em] neon-text-cyan uppercase", children: "IP THREAT SCANNER" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 tracking-[0.22em] mt-1 uppercase", children: ">> SECURE ACCESS TERMINAL <<" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-cyan-500/15" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-transparent px-3 text-[10px] font-mono text-muted-foreground/40 tracking-[0.25em] uppercase", children: "AUTHENTICATE" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubmit,
                noValidate: true,
                className: "flex flex-col gap-4",
                "data-ocid": "login.form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "login-email",
                        className: "block font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase mb-1.5",
                        children: "Email Address"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonInput,
                      {
                        id: "login-email",
                        type: "email",
                        placeholder: "operator@domain.io",
                        value: email,
                        onChange: (v) => {
                          setEmail(v);
                          setServerError(null);
                        },
                        onBlur: () => setTouched((t) => ({ ...t, email: true })),
                        error: fieldErrors.email,
                        disabled: isLoading,
                        "data-ocid": "login.email.input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "login-password",
                        className: "block font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase mb-1.5",
                        children: "Password"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NeonInput,
                      {
                        id: "login-password",
                        type: "password",
                        placeholder: "••••••••••••",
                        value: password,
                        onChange: (v) => {
                          setPassword(v);
                          setServerError(null);
                        },
                        onBlur: () => setTouched((t) => ({ ...t, password: true })),
                        error: fieldErrors.password,
                        disabled: isLoading,
                        "data-ocid": "login.password.input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: serverError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      "data-ocid": "login.error_state",
                      initial: { opacity: 0, scale: 0.97, y: -4 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      exit: { opacity: 0, scale: 0.97 },
                      transition: { duration: 0.2 },
                      className: "flex items-start gap-2 bg-red-500/10 border border-red-500/35 rounded-lg px-4 py-3 neon-border-red",
                      role: "alert",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs neon-text-red leading-relaxed", children: [
                        "⚠ ",
                        serverError
                      ] })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      "data-ocid": "login.submit_button",
                      type: "submit",
                      disabled: isLoading,
                      whileTap: { scale: isLoading ? 1 : 0.97 },
                      className: [
                        "relative w-full mt-1 py-3.5 rounded-lg overflow-hidden",
                        "font-display font-bold text-sm tracking-[0.22em] uppercase",
                        "transition-all duration-200 outline-none cursor-pointer",
                        "bg-cyan-500/10 border border-cyan-400/55 text-cyan-300",
                        "hover:bg-cyan-500/18 hover:border-cyan-300/80 hover:text-cyan-100",
                        "focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                        "shadow-[0_0_18px_rgba(0,212,255,0.18)] hover:shadow-[0_0_28px_rgba(0,212,255,0.38)]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      ].join(" "),
                      children: [
                        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/8 to-transparent pointer-events-none",
                            style: { animation: "shimmer 2.8s infinite linear" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative flex items-center justify-center gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CyberSpinner, {}),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-ocid": "login.loading_state", children: "AUTHENTICATING…" })
                        ] }) : "AUTHENTICATE" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center font-mono text-xs text-muted-foreground/60", children: [
              "No access credentials?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  "data-ocid": "login.signup.link",
                  href: "/signup",
                  onClick: (e) => {
                    e.preventDefault();
                    void navigate({ to: "/signup" });
                  },
                  className: "neon-text-cyan hover:opacity-80 transition-all duration-150 hover:underline underline-offset-2",
                  children: "REQUEST ACCESS"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-0 left-0 right-0 z-10 border-t border-cyan-500/8 bg-black/50 backdrop-blur-sm px-4 py-1.5 flex items-center justify-between pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/40 tracking-widest", children: "SYS:ONLINE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-cyan-500/50 tracking-widest animate-pulse", children: "● ENCRYPTED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/40 tracking-widest", children: "v2.4.1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      ` })
  ] });
}
export {
  LoginPage as default
};
