"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createChat, findSessionChat } from "@/store/chatSlice";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const DynamicChatPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const dispatch = useAppDispatch();
  const params = useParams();
  const sessionId = params?.id as string;

  const chatData = useAppSelector((state) => state.chat.currentSession);
  useEffect(() => {
    if (sessionId) {
      dispatch(findSessionChat(sessionId));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (chatData?.chats) {
      const formatted = chatData.chats.flatMap((c: any) => [
        { sender: "user", text: c.userText },
        { sender: "ai", text: c.aiData },
      ]);
      setLocalMessages(formatted);
    }
  }, [chatData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText;
    setInputText("");
    setLocalMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuery },
      { sender: "ai", text: "" },
    ]);

    try {
      const res = await dispatch(
        createChat({ text: userQuery, sessionId }),
      ).unwrap();
      const reader = res.body.getReader();
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
      dispatch(findSessionChat(sessionId));
    } catch (error) {
      console.error("Streaming error:", error);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-5 font-bold">Chat Session</h1>

      <div className="flex flex-col gap-4 mb-5 max-h-[600px] overflow-y-auto">
        {localMessages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-gray-200 self-end text-right"
                : "bg-blue-100 self-start text-left"
            }`}
          >
            <strong>{msg.sender === "user" ? "You: " : "AI: "}</strong>
            {msg.text || (msg.sender === "ai" && "Typing...")}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          placeholder="Continue chat..."
          className="border py-3 text-lg flex-1 px-4 rounded"
        />
        <button
          type="submit"
          className="border px-6 py-3 bg-blue-600 text-white rounded font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default DynamicChatPage;
