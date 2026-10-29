
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createChat, findSessionChat } from "@/store/chatSlice";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DynamicChatPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const dispatch = useAppDispatch();
  const params = useParams();
  const sessionId = params?.id as string;

  const chatData = useAppSelector((state) => state.chat.currentSession);
  const loading = useAppSelector((state) => state.chat.loading);

  useEffect(() => {
    if (sessionId) {
      dispatch(findSessionChat(sessionId));
    }
  }, [dispatch, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await dispatch(createChat({ text: inputText, sessionId }));
    setInputText("");
    dispatch(findSessionChat(sessionId));
  };

  return (
    <div className="p-5">
      <div className="text-3xl mb-5">Chat Session</div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4 mb-5">
          {chatData?.chats?.map((chat: any, id: number) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="bg-gray-100 p-3 rounded">
                <strong>User: </strong> {chat.userInput}
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <strong>AI: </strong> {chat.aiData}
              </div>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          placeholder="Continue chat..."
          className="border py-3 text-lg w-[700px] px-4"
        />
        <button type="submit" className="border px-4 bg-blue-600 text-white">
          Send
        </button>
      </form>
    </div>
  );
};
export default DynamicChatPage;


























