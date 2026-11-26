"use client";

import { useState, useRef, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoginAdminHandler } from "@/Hooks/useAdminHandler";

// ── Sanitizers ────────────────────────────────────────────────────────────────
// Control chars (null, newline, tab, etc.) hata do
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

// Email: spaces, control chars aur HTML/injection wale characters nikal do, lowercase karo
const sanitizeEmail = (value: string) =>
   value
      .replace(CONTROL_CHARS, "")
      .replace(/[\s<>"'`\\;(),:[\]]/g, "")
      .toLowerCase()
      .slice(0, EMAIL_MAX);

// Password: sirf control chars hatao (baaki characters waise hi rehne chahiye, warna password change ho jayega)
const sanitizePassword = (value: string) => value.replace(CONTROL_CHARS, "").slice(0, PASSWORD_MAX);

// ── Validators ────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

type FieldErrors = { email?: string; password?: string };

function validateEmail(email: string): string | undefined {
   if (!email) return "Email is required";
   if (email.length > EMAIL_MAX) return "Email is too long";
   if (!EMAIL_REGEX.test(email)) return "Enter a valid email address";
   return undefined;
}

function validatePassword(password: string): string | undefined {
   if (!password) return "Password is required";
   if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`;
   if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters`;
   if (/\s/.test(password.charAt(0)) || /\s/.test(password.charAt(password.length - 1))) return "Password cannot start or end with a space";
   return undefined;
}

// ── Lockout (client side) ─────────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 30;

// ── Small UI pieces ───────────────────────────────────────────────────────────
const FEATURES = [
   { title: "Products & collections", text: "Variants, pricing by region and stock in one place." },
   { title: "Orders & customers", text: "Track every order from placement to delivery." },
   { title: "Content management", text: "Update storefront pages without touching code." },
];

function BrandPanel() {
   return (
      <aside className="relative hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between overflow-hidden bg-primaryBG px-12 xl:px-16 py-14 text-[#F5F0E8]" aria-hidden="true">
         {/* Decorative rings */}
         <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-[#B8975A]/20" />
         <div className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full border border-[#B8975A]/25" />
         <div className="pointer-events-none absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full border border-[#B8975A]/15" />
         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(184,151,90,0.14),transparent_60%)]" />

         <div className="relative flex items-center gap-3">
            <span className="h-px w-10 bg-[#B8975A]" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#B8975A]">Admin Console</span>
         </div>

         <div className="relative max-w-[440px]">
            <h2 className="font-serif text-[40px] xl:text-[46px] leading-[1.12] font-normal tracking-[0.01em]">
               Run your store with <span className="text-[#B8975A] italic">quiet confidence.</span>
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-[#F5F0E8]/70">Everything you need to curate the catalogue, manage orders and keep the storefront looking exactly right.</p>

            <ul className="mt-10 flex flex-col gap-5">
               {FEATURES.map((f) => (
                  <li key={f.title} className="flex gap-4">
                     <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#B8975A]" />
                     <div>
                        <p className="text-[13px] font-medium tracking-[0.03em]">{f.title}</p>
                        <p className="text-[12.5px] leading-relaxed text-[#F5F0E8]/60 mt-0.5">{f.text}</p>
                     </div>
                  </li>
               ))}
            </ul>
         </div>

         <p className="relative text-[11px] tracking-[0.08em] text-[#F5F0E8]/45">Authorised personnel only</p>
      </aside>
   );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
   const router = useRouter();
   const { handleLoginAdmin } = useLoginAdminHandler();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [capsOn, setCapsOn] = useState(false);
   const [errors, setErrors] = useState<FieldErrors>({});
   const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
   const [formError, setFormError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [lockedFor, setLockedFor] = useState(0);

   const attempts = useRef(0);
   const lockTimer = useRef<ReturnType<typeof setInterval> | null>(null);

   // Timer cleanup
   useEffect(() => {
      return () => {
         if (lockTimer.current) clearInterval(lockTimer.current);
      };
   }, []);

   const startLock = () => {
      setLockedFor(LOCK_SECONDS);
      if (lockTimer.current) clearInterval(lockTimer.current);
      lockTimer.current = setInterval(() => {
         setLockedFor((s) => {
            if (s <= 1) {
               if (lockTimer.current) clearInterval(lockTimer.current);
               attempts.current = 0;
               return 0;
            }
            return s - 1;
         });
      }, 1000);
   };

   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeEmail(e.target.value);
      setEmail(value);
      setFormError("");
      if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
   };

   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = sanitizePassword(e.target.value);
      setPassword(value);
      setFormError("");
      if (touched.password) setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
   };

   const handlePasswordKey = (e: KeyboardEvent<HTMLInputElement>) => {
      setCapsOn(e.getModifierState?.("CapsLock") ?? false);
   };

   const handleBlur = (field: "email" | "password") => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({
         ...prev,
         [field]: field === "email" ? validateEmail(email) : validatePassword(password),
      }));
      if (field === "password") setCapsOn(false);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || lockedFor > 0) return;

      const cleanEmail = sanitizeEmail(email);
      const cleanPassword = sanitizePassword(password);

      const nextErrors: FieldErrors = {
         email: validateEmail(cleanEmail),
         password: validatePassword(cleanPassword),
      };
      setErrors(nextErrors);
      setTouched({ email: true, password: true });
      setFormError("");

      if (nextErrors.email || nextErrors.password) return;

      setIsSubmitting(true);
      try {
         const res = await handleLoginAdmin({ email: cleanEmail, password: cleanPassword });

         if (res.success) {
            router.replace("/admin/dashboard");
            return;
         }

         attempts.current += 1;
         setPassword("");
         if (attempts.current >= MAX_ATTEMPTS) {
            setFormError(`Too many failed attempts. Try again in ${LOCK_SECONDS} seconds.`);
            startLock();
         } else {
            setFormError(res.message || "Invalid email or password");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const inputCls = (error?: string) =>
      `w-full h-12 pl-11 pr-4 text-[14px] bg-white/70 border rounded-xl text-headingColor placeholder:text-[#5E5F60]/55
      transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed
      ${error ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-[#B8975A]/25 hover:border-[#B8975A]/45 focus:border-[#B8975A] focus:ring-4 focus:ring-[#B8975A]/15"}`;

   const disabled = isSubmitting || lockedFor > 0;

   return (
      <main className="min-h-screen flex bg-[#F5F0E8]">
         <BrandPanel />

         {/* Form side */}
         <section className="relative flex flex-1 items-center justify-center px-5 sm:px-8 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,151,90,0.10),transparent_60%)] lg:hidden" />

            <div className="relative w-full max-w-[400px]">
               {/* Logo */}
               <div className="flex justify-center lg:justify-start mb-10">
                  <Image src="/Common/Logo.png" alt="Pinacle Luxe" width={220} height={64} priority className="h-auto w-[190px] object-contain" />
               </div>

               {/* Heading */}
               <div className="mb-8 text-center lg:text-left">
                  <h1 className="font-serif text-[32px] sm:text-[36px] font-normal text-headingColor tracking-[0.01em] leading-tight">Welcome back</h1>
                  <p className="text-[13.5px] text-[#5E5F60] mt-2">Sign in to your admin account to continue.</p>
               </div>

               <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Form level error */}
                  {formError && (
                     <div role="alert" className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-700">
                        <svg className="shrink-0 mt-px" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                           <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                           <path d="M8 4.8v3.8M8 10.9v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>{lockedFor > 0 ? `Too many failed attempts. Try again in ${lockedFor}s.` : formError}</span>
                     </div>
                  )}

                  {/* Email */}
                  <div>
                     <label htmlFor="email" className="block text-[12px] font-medium text-headingColor mb-2">
                        Email address
                     </label>
                     <div className="relative">
                        <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B8975A]" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                           <rect x="2" y="3.5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                           <path d="M2.5 5l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                           id="email"
                           name="email"
                           type="email"
                           inputMode="email"
                           autoComplete="username"
                           autoCapitalize="none"
                           spellCheck={false}
                           maxLength={EMAIL_MAX}
                           placeholder="admin@example.com"
                           value={email}
                           onChange={handleEmailChange}
                           onBlur={() => handleBlur("email")}
                           disabled={disabled}
                           aria-invalid={!!errors.email}
                           aria-describedby={errors.email ? "email-error" : undefined}
                           className={inputCls(errors.email)}
                        />
                     </div>
                     {errors.email && (
                        <p id="email-error" className="text-[12px] text-red-600 mt-1.5">
                           {errors.email}
                        </p>
                     )}
                  </div>

                  {/* Password */}
                  <div>
                     <label htmlFor="password" className="block text-[12px] font-medium text-headingColor mb-2">
                        Password
                     </label>
                     <div className="relative">
                        <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B8975A]" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                           <rect x="3" y="8" width="12" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.3" />
                           <path d="M5.5 8V5.8a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        <input
                           id="password"
                           name="password"
                           type={showPassword ? "text" : "password"}
                           autoComplete="current-password"
                           maxLength={PASSWORD_MAX}
                           placeholder="Enter your password"
                           value={password}
                           onChange={handlePasswordChange}
                           onKeyUp={handlePasswordKey}
                           onKeyDown={handlePasswordKey}
                           onBlur={() => handleBlur("password")}
                           disabled={disabled}
                           aria-invalid={!!errors.password}
                           aria-describedby={errors.password ? "password-error" : capsOn ? "caps-warning" : undefined}
                           className={`${inputCls(errors.password)} pr-12`}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((s) => !s)}
                           aria-label={showPassword ? "Hide password" : "Show password"}
                           aria-pressed={showPassword}
                           className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-lg text-[#5E5F60] hover:text-[#B8975A] hover:bg-[#B8975A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8975A]/50 transition-colors"
                        >
                           {showPassword ? (
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                 <path d="M2 2l14 14M7.5 7.6A2 2 0 0 0 10.4 10.5M4.3 4.9C2.9 5.9 1.8 7.3 1.3 9c1 3 3.8 5 7.7 5 1.3 0 2.5-.3 3.5-.8M7 4.2C7.6 4.1 8.3 4 9 4c3.9 0 6.7 2 7.7 5-.3.9-.8 1.7-1.4 2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           ) : (
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                 <path d="M1.3 9C2.3 6 5.1 4 9 4s6.7 2 7.7 5c-1 3-3.8 5-7.7 5S2.3 12 1.3 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                                 <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.3" />
                              </svg>
                           )}
                        </button>
                     </div>
                     {errors.password && (
                        <p id="password-error" className="text-[12px] text-red-600 mt-1.5">
                           {errors.password}
                        </p>
                     )}
                     {!errors.password && capsOn && (
                        <p id="caps-warning" className="flex items-center gap-1.5 text-[12px] text-amber-700 mt-1.5">
                           <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M6 1.5L1.5 10.5h9L6 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                              <path d="M6 5v2.5M6 9v.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                           </svg>
                           Caps Lock is on
                        </p>
                     )}
                  </div>

                  {/* Submit */}
                  <button
                     type="submit"
                     disabled={disabled}
                     className="group mt-2 flex items-center justify-center gap-2 w-full h-12 bg-primaryBG text-[#E4CFA0] text-[13.5px] font-medium tracking-[0.08em] uppercase rounded-xl
                        shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)] transition-all duration-200
                        hover:bg-headingColor hover:text-[#B8975A] active:scale-[0.99]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B8975A]/30
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
                  >
                     {isSubmitting ? (
                        <>
                           <svg className="animate-spin" width="16" height="16" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                              <path d="M24 4a20 20 0 1 0 20 20A20.022 20.022 0 0 0 24 4Zm0 36a16 16 0 1 1 16-16 16.019 16.019 0 0 1-16 16Z" fill="currentColor" opacity=".3" />
                              <path d="M24 4a20 20 0 0 1 20 20h-4a16 16 0 0 0-16-16Z" fill="currentColor" />
                           </svg>
                           Signing in...
                        </>
                     ) : lockedFor > 0 ? (
                        `Locked (${lockedFor}s)`
                     ) : (
                        <>
                           Sign In
                           <svg className="transition-transform duration-200 group-hover:translate-x-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        </>
                     )}
                  </button>
               </form>

               <p className="text-center lg:text-left text-[11.5px] text-[#5E5F60] mt-10">© {new Date().getFullYear()} Pinacle Luxe. All rights reserved.</p>
            </div>
         </section>
      </main>
   );
}
