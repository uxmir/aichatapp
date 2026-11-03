"use client";

import React,{Suspense} from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/40">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center  gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-100">
            ChatMir <span className="text-indigo-400">AI</span>
          </span>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto">
        
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Gen AI Workspace</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Meet Your Intelligent <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistant
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Experience lightning-fast SSE streaming, persistent session histories, and a high-end interface built for professional developers and creators.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/chat" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all duration-200 group">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Feature Highlights Footer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-20 text-left">
          
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Real-time Streaming</h3>
              <p className="text-xs text-slate-500">Instant AI response rendering via SSE</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3.5">
            <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Secure Sessions</h3>
              <p className="text-xs text-slate-500">Google OAuth & HTTP-only cookies</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
         {/* Footer copyright */}
            <Suspense><TimeDiv/></Suspense>
    </div>
  );
}

const TimeDiv = () => {
  return (
    <>
      <div className="mb-5 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} ChatMir AI. All rights reserved.
      </div>
    </>
  );
};