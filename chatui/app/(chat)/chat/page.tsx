"use client";

import { useAppDispatch } from "@/lib/hooks";
import { createChat,findSessionTitle } from "@/store/chatSlice";
import { useRouter } from "next/navigation"; 
import React, { useState } from "react";
const Page: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const resultAction = await dispatch(createChat({ text: inputText }));
    
    if (createChat.fulfilled.match(resultAction)) {
      const payload = resultAction.payload;
      let sessionId = null;
      if (typeof payload === 'string') {
        const match = payload.match(/"_id"\s*:\s*"([0-9a-fA-F]{24})"/);
        if (match && match[1]) {
          sessionId = match[1];
        }
      } else {
        sessionId = payload?.session?._id || payload?.data?._id || payload?._id;
      }
      if (sessionId) {
        router.push(`/${sessionId}`);
      } else {
        console.error("Failed to extract sessionId from chat creation payload.");
      }
    }
  };
  return (
    <div>
      <div className="text-4xl mb-4">Chat with Mir</div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          placeholder="Ask something..."
          className="border py-4 text-xl w-[600px] px-5"
        />
        <button type="submit" className="border px-4 bg-black text-white">Send</button>
      </form>
    </div>
  );
};

export default Page;