// "use client";

// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { createChat, findSessionChat } from "@/store/chatSlice";
// import { useParams } from "next/navigation";
// import React, { Suspense, useEffect, useState } from "react";

// interface ChatMessage {
//   sender: "user" | "ai";
//   text: string;
// }

// const ChatContent: React.FC = () => {
//   const [inputText, setInputText] = useState<string>("");
//   const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

//   const dispatch = useAppDispatch();
//   const params = useParams();
//   const sessionId = params?.id as string;

//   const chatData = useAppSelector((state) => state.chat.currentSession);

//   useEffect(() => {
//     if (sessionId) {
//       dispatch(findSessionChat(sessionId));
//     }
//   }, [dispatch, sessionId]);

//   useEffect(() => {
//     if (chatData?.chats) {
//       const formatted = chatData.chats.flatMap((c: any) => [
//         { sender: "user" as "user", text: c.userInput },
//         { sender: "ai" as "ai", text: c.aiData },
//       ]);
//       setLocalMessages(formatted);
//     }
//   }, [chatData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     const userQuery = inputText;
//     setInputText("");
//     setLocalMessages((prev) => [
//       ...prev,
//       { sender: "user", text: userQuery },
//       { sender: "ai", text: "" },
//     ]);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API}/api/v2/chat/create`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ text: userQuery, sessionId }),
//         },
//       );

//       if (!response.body) throw new Error("Response body is null");
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let currentAiReply = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         const lines = chunk.split("\n\n");

//         for (const line of lines) {
//           if (line.startsWith("data:")) {
//             const rawJson = line.replace("data:", "").trim();
//             if (!rawJson) continue;

//             const jsonData = JSON.parse(rawJson);
//             const newText = jsonData.text || jsonData;

//             currentAiReply += newText;
//             setLocalMessages((prev) => {
//               const updated = [...prev];
//               updated[updated.length - 1] = {
//                 sender: "ai",
//                 text: currentAiReply,
//               };
//               return updated;
//             });
//           }
//         }
//       }
//       dispatch(findSessionChat(sessionId));
//     } catch (error) {
//       console.error("Streaming error:", error);
//     }
//   };

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h1 className="text-3xl mb-5 font-bold">Chat Session</h1>

//       <div className="flex flex-col gap-4 mb-5 max-h-[600px] overflow-y-auto">
//         {localMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-3 rounded-lg max-w-[80%] ${
//               msg.sender === "user"
//                 ? "bg-gray-200 self-end text-right"
//                 : "bg-blue-100 self-start text-left"
//             }`}
//           >
//             <strong>{msg.sender === "user" ? "You: " : "AI: "}</strong>
//             {msg.text || (msg.sender === "ai" && "Typing...")}
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           type="text"
//           placeholder="Continue chat..."
//           className="border py-3 text-lg flex-1 px-4 rounded"
//         />
//         <button
//           type="submit"
//           className="border px-6 py-3 bg-blue-600 text-white rounded font-medium"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// const DynamicChatPage: React.FC = () => {
//   return (
//     <Suspense
//       fallback={<div className="p-5 text-center">Loading chat session...</div>}
//     >
//       <ChatContent />
//     </Suspense>
//   );
// };

// export default DynamicChatPage;


"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createChat, findSessionChat } from "@/store/chatSlice";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const ChatContent: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const params = useParams();
  const sessionId = params?.id as string;

  const chatData = useAppSelector((state) => state.chat.currentSession);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // অটো-স্ক্রোল ফাংশন যাতে নতুন মেসেজ আসলে নিচে নেমে যায়
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    if (sessionId) {
      dispatch(findSessionChat(sessionId));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (chatData?.chats) {
      const formatted = chatData.chats.flatMap((c: any) => [
        { sender: "user" as "user", text: c.userInput },
        { sender: "ai" as "ai", text: c.aiData },
      ]);
      setLocalMessages(formatted);
    }
  }, [chatData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    const userQuery = inputText;
    setInputText("");
    setIsStreaming(true);

    setLocalMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuery },
      { sender: "ai", text: "" },
    ]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v2/chat/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: userQuery, sessionId }),
        },
      );

      if (!response.body) throw new Error("Response body is null");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentAiReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const rawJson = line.replace("data:", "").trim();
            if (!rawJson) continue;

            const jsonData = JSON.parse(rawJson);
            const newText = jsonData.text || jsonData;

            currentAiReply += newText;
            setLocalMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                sender: "ai",
                text: currentAiReply,
              };
              return updated;
            });
          }
        }
      }
      setIsStreaming(false);
      dispatch(findSessionChat(sessionId));
    } catch (error) {
      console.error("Streaming error:", error);
      setIsStreaming(false);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-3 ml-10">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100">Chat Session</h1>
            <p className="text-xs text-slate-400">ID: {sessionId?.slice(0, 10)}...</p>
          </div>
        </div>
      </header>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-3 text-slate-500">
              <Bot className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm">No messages yet. Start the conversation below!</p>
            </div>
          ) : (
            localMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 border border-slate-700 text-indigo-400"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Box */}
                <div
                  className={`max-w-[80%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-sm"
                  }`}
                >
                  {msg.text ? (
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  ) : (
                    <div className="flex items-center space-x-2 text-indigo-400 py-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs italic">AI is generating response...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Footer Form */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              type="text"
              placeholder="Type your message here..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm md:text-base rounded-2xl py-3.5 pl-4 pr-14 shadow-inner focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isStreaming}
              className="absolute right-2.5 p-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl shadow-md transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:active:scale-100 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[11px] text-slate-500">AI can make mistakes. Verify important info.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const DynamicChatPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-slate-950 text-indigo-400">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading chat session...</span>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
};

export default DynamicChatPage;