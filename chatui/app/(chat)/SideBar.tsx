"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { findSessionTitle } from "@/store/chatSlice";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
const SideBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const titleData = useAppSelector((state) => state.chat.sessions);

  useEffect(() => {
    dispatch(findSessionTitle());
  }, [dispatch]);

  return (
    <div className="w-64 h-[100vh] fixed top-0 border-r p-4 overflow-y-auto">
      <h2 className="font-bold mb-4">Chat History</h2>
      {Array.isArray(titleData) &&
        titleData?.map((t: any) => (
          <div key={t._id} className="flex flex-col gap-y-2 mb-2">
            <Link href={`/${t._id}`} className="hover:text-blue-500 truncate">
              <span>{t.title}</span>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default SideBar