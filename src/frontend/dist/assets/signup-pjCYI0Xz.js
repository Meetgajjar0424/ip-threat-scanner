import { u as useNavigate, a as useAuthStore, r as reactExports, j as jsxRuntimeExports } from "./index-Cjluslwg.js";
import { C as CyberBackground, m as motion, G as GlassCard, A as AnimatePresence } from "./proxy-Ceh10oOd.js";
import { c as createLucideIcon, S as ShieldCheck } from "./shield-check-Dh0sBpTe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
function validate(data) {
  const errors = {};
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
function SignupPage() {
  const navigate = useNavigate();
  const {
    signup,
    error: authError,
    clearError,
    isAuthenticated
  } = useAuthStore();
  const [form, setForm] = reactExports.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);
  reactExports.useEffect(() => {
    if (authError) {
      setErrors((prev) => ({ ...prev, global: authError }));
    }
  }, [authError]);
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const updated = { ...form, [field]: value };
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
    if (authError) clearError();
    if (errors.global) setErrors((prev) => ({ ...prev, global: void 0 }));
  };
  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsLoading(true);
    clearError();
    setErrors({});
    await new Promise((res) => setTimeout(res, 600));
    const success = signup(
      form.username.trim(),
      form.email.trim(),
      form.password
    );
    if (!success) {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CyberBackground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg opacity-40 pointer-events-none z-[1]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanline absolute inset-0 pointer-events-none z-[2] opacity-50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 36, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        className: "relative z-10 w-full max-w-md px-4 py-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { glow: "purple", className: "p-8", "data-ocid": "signup.card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-7 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0, rotate: -20 },
                animate: { scale: 1, rotate: 0 },
                transition: {
                  delay: 0.18,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                },
                className: "flex justify-center mb-4",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-full glassmorphism glow-purple", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ShieldCheck,
                  {
                    className: "w-9 h-9 neon-text-cyan",
                    "aria-hidden": "true"
                  }
                ) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold uppercase tracking-widest neon-text-cyan mb-1", children: "Create Access" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-mono tracking-wide", children: "Initialize your CyberGuard account" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: errors.global && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, height: 0, marginBottom: 0 },
              animate: { opacity: 1, height: "auto", marginBottom: 20 },
              exit: { opacity: 0, height: 0, marginBottom: 0 },
              transition: { duration: 0.25 },
              "data-ocid": "signup.error_state",
              className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-mono neon-text-red overflow-hidden",
              role: "alert",
              "aria-live": "polite",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleAlert,
                  {
                    className: "w-4 h-4 flex-shrink-0",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: errors.global })
              ]
            },
            "global-error"
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSubmit,
              noValidate: true,
              className: "space-y-5",
              "data-ocid": "signup.form",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "signup-username",
                      className: "block text-xs font-display uppercase tracking-widest text-muted-foreground",
                      children: "Username"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "signup-username",
                      type: "text",
                      autoComplete: "username",
                      value: form.username,
                      onChange: handleChange("username"),
                      onBlur: handleBlur("username"),
                      "data-ocid": "signup.username.input",
                      "aria-describedby": errors.username ? "signup-username-error" : void 0,
                      "aria-invalid": !!errors.username,
                      placeholder: "agent_zero",
                      className: "w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                    }
                  ),
                  touched.username && errors.username && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      id: "signup-username-error",
                      "data-ocid": "signup.username.field_error",
                      className: "text-xs font-mono neon-text-red flex items-center gap-1",
                      role: "alert",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3", "aria-hidden": "true" }),
                        errors.username
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "signup-email",
                      className: "block text-xs font-display uppercase tracking-widest text-muted-foreground",
                      children: "Email"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "signup-email",
                      type: "email",
                      autoComplete: "email",
                      value: form.email,
                      onChange: handleChange("email"),
                      onBlur: handleBlur("email"),
                      "data-ocid": "signup.email.input",
                      "aria-describedby": errors.email ? "signup-email-error" : void 0,
                      "aria-invalid": !!errors.email,
                      placeholder: "agent@cyberguard.io",
                      className: "w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                    }
                  ),
                  touched.email && errors.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      id: "signup-email-error",
                      "data-ocid": "signup.email.field_error",
                      className: "text-xs font-mono neon-text-red flex items-center gap-1",
                      role: "alert",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3", "aria-hidden": "true" }),
                        errors.email
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "signup-password",
                      className: "block text-xs font-display uppercase tracking-widest text-muted-foreground",
                      children: "Password"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-password",
                        type: showPassword ? "text" : "password",
                        autoComplete: "new-password",
                        value: form.password,
                        onChange: handleChange("password"),
                        onBlur: handleBlur("password"),
                        "data-ocid": "signup.password.input",
                        "aria-describedby": errors.password ? "signup-password-error" : void 0,
                        "aria-invalid": !!errors.password,
                        placeholder: "Min. 6 characters",
                        className: "w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 pr-11 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowPassword((p) => !p),
                        "data-ocid": "signup.password.toggle",
                        "aria-label": showPassword ? "Hide password" : "Show password",
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded p-0.5",
                        children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "aria-hidden": "true" })
                      }
                    )
                  ] }),
                  touched.password && errors.password && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      id: "signup-password-error",
                      "data-ocid": "signup.password.field_error",
                      className: "text-xs font-mono neon-text-red flex items-center gap-1",
                      role: "alert",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3", "aria-hidden": "true" }),
                        errors.password
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "signup-confirm",
                      className: "block text-xs font-display uppercase tracking-widest text-muted-foreground",
                      children: "Confirm Password"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-confirm",
                        type: showConfirm ? "text" : "password",
                        autoComplete: "new-password",
                        value: form.confirmPassword,
                        onChange: handleChange("confirmPassword"),
                        onBlur: handleBlur("confirmPassword"),
                        "data-ocid": "signup.confirm_password.input",
                        "aria-describedby": errors.confirmPassword ? "signup-confirm-error" : void 0,
                        "aria-invalid": !!errors.confirmPassword,
                        placeholder: "Repeat password",
                        className: "w-full bg-background/40 border border-input rounded-lg px-4 py-2.5 pr-11 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/70 transition-smooth"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowConfirm((p) => !p),
                        "data-ocid": "signup.confirm_password.toggle",
                        "aria-label": showConfirm ? "Hide confirm password" : "Show confirm password",
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded p-0.5",
                        children: showConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "aria-hidden": "true" })
                      }
                    )
                  ] }),
                  touched.confirmPassword && errors.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      id: "signup-confirm-error",
                      "data-ocid": "signup.confirm_password.field_error",
                      className: "text-xs font-mono neon-text-red flex items-center gap-1",
                      role: "alert",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3", "aria-hidden": "true" }),
                        errors.confirmPassword
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    type: "submit",
                    disabled: isLoading,
                    "data-ocid": "signup.submit_button",
                    whileHover: { scale: isLoading ? 1 : 1.02 },
                    whileTap: { scale: isLoading ? 1 : 0.97 },
                    className: "relative w-full mt-2 py-3 rounded-lg font-display uppercase tracking-widest text-sm font-bold text-foreground transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.42 0.22 289 / 0.9), oklch(0.32 0.2 262 / 0.9))",
                      boxShadow: isLoading ? "0 0 12px 2px rgba(184,79,255,0.2)" : "0 0 22px 4px rgba(184,79,255,0.45), 0 0 44px 8px rgba(184,79,255,0.15)",
                      border: "1px solid rgba(184,79,255,0.55)"
                    },
                    children: [
                      !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "absolute inset-0 rounded-lg animate-[pulse_2.2s_ease-in-out_infinite]",
                          style: { boxShadow: "inset 0 0 18px rgba(184,79,255,0.18)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 flex items-center justify-center gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          LoaderCircle,
                          {
                            className: "w-4 h-4 animate-spin",
                            "aria-hidden": "true",
                            "data-ocid": "signup.loading_state"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Initializing..." })
                      ] }) : "Initialize Account" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm font-mono text-muted-foreground", children: [
            "Already have access?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/login",
                "data-ocid": "signup.login.link",
                className: "neon-text-cyan hover:opacity-80 transition-smooth focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded",
                onClick: (e) => {
                  e.preventDefault();
                  void navigate({ to: "/login" });
                },
                children: "Login"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  SignupPage as default
};
