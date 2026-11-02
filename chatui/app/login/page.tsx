"use client";

import React, { Suspense } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl =
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ||
      "http://localhost:5000/api/v1/auth/google";
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 overflow-hidden px-4 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow & Ambient Effects */}
      <div className="absolute top-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-indigo-500/10 flex flex-col items-center text-center">
        {/* Brand / Logo Icon */}
        <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/25 ring-1 ring-white/15 mb-6">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-3">
          Welcome to ChatMir
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
          Sign in to access your intelligent AI assistant, saved chat sessions,
          and real-time streams.
        </p>

        {/* Google Login Button (Keeping original logic intact) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-semibold rounded-2xl shadow-lg transition-all duration-200 group"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.32 7.22 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="text-base font-medium">Continue with Google</span>
        </button>

        {/* Features / Trust Badges at Bottom of Card */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-slate-800/80 text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Lightning Fast SSE
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-violet-500/10 rounded-lg text-violet-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Secure Passport Auth
            </span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <Suspense><TimeDiv/></Suspense>
    </div>
  );
};

const TimeDiv = () => {
  return (
    <>
      <div className="absolute bottom-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} ChatMir AI. All rights reserved.
      </div>
    </>
  );
};

export default LoginPage;
