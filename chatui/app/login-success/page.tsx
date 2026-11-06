"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import Cookies from "js-cookie";
export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch=useAppDispatch()
  useEffect(() => {
    if (token) {
      Cookies.set("accessToken", token, { 
        expires: 15 / 1440, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax" 
      });
      router.replace("/chat");
    } else {
      router.replace("/login");
    }
  }, [token, router, dispatch]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 overflow-hidden px-4 selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative z-10 w-full max-w-sm p-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-indigo-500/10 flex flex-col items-center text-center">
        {/* Brand Logo Icon with Pulse */}
        <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/25 ring-1 ring-white/15 mb-6">
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
        </div>

        {/* Loading Spinner & Success Message */}
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Login Successful!
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Authenticating your session and setting up your workspace...
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center text-xs text-slate-600">
        ChatMir AI &bull; Secure Authentication
      </div>
    </div>
  );
}
