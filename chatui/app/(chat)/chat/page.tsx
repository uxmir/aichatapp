
"use client";

import { useAppDispatch } from "@/lib/hooks";
import { createChat, findSessionTitle } from "@/store/chatSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react"; 

const Page: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resultAction = await dispatch(createChat({ text: inputText }));

      if (createChat.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        let sessionId = null;

        if (typeof payload === "string") {
          const match = payload.match(/"_id"\s*:\s*"([0-9a-fA-F]{24})"/);
          if (match && match[1]) {
            sessionId = match[1];
          }
        } else {
          sessionId =
            payload?.session?._id || payload?.data?._id || payload?._id;
        }

        if (sessionId) {
          router.push(`/${sessionId}`);
        } else {
          console.error(
            "Failed to extract sessionId from chat creation payload.",
          );
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 px-4 selection:bg-indigo-500 selection:text-white">
      {/* Main Container Centered */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-8 -mt-16">
        {/* Header Title with AI Logo */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            What can I help you with, Mir?
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Ask anything, explore ideas, or start a new conversation below.
          </p>
        </div>

        {/* Form / Input Area */}
        <div className="w-full relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              type="text"
              placeholder="Ask something to ChatMir..."
              className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-slate-100 placeholder-slate-500 text-base md:text-lg rounded-2xl py-4 pl-5 pr-14 shadow-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-3 p-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl shadow-md transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:active:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Loading Indicator Text / Subtext */}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 mt-4 text-indigo-400 text-sm animate-pulse">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <span>AI is thinking & setting up your session...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips (Optional aesthetic touch) */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {[
            "Build a full-stack app",
            "Explain async await",
            "Optimize MongoDB query",
            "Write React custom hook",
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(chip)}
              className="text-xs md:text-sm bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Page;
