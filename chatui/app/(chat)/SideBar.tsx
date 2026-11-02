"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { findSessionTitle } from "@/store/chatSlice";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { Plus, MessageSquare, MoreVertical, Menu, X, User, Edit3, Trash2,LogOut  } from "lucide-react";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
const SideBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const titleData = useAppSelector((state) => state.chat.sessions);
  const user=useAppSelector((state)=>state.auth.auth)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router=useRouter()
  useEffect(() => {
    dispatch(findSessionTitle());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout()); 
   router.push("/login")
};

  return (
    <>
      {/* Mobile Top Toggle Button Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-semibold text-slate-200">ChatMir</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
      {/* Main Sidebar Component */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section: Title & New Chat */}
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 px-2 pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                M
              </div>
              <h2 className="font-bold text-slate-100 text-lg tracking-tight">Chat History</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <Link href={"/chat"} onClick={() => setIsOpen(false)} className="mb-6">
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium rounded-xl shadow-md shadow-indigo-600/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </Link>

          {/* History List Container */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2 tracking-wider">
              Recent Conversations
            </div>

            {Array.isArray(titleData) && titleData.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No chat history found.
              </div>
            ) : (
              titleData?.map((t: any, index: number) => {
                if (!t || !t._id) return null;
                const isDropdownOpen = activeDropdown === index;

                return (
                  <div
                    key={index}
                    className="group relative flex items-center justify-between rounded-xl hover:bg-slate-900/80 transition-all"
                  >
                    {/* Chat Link */}
                    <Link
                      href={`/${t._id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 flex-1 min-w-0 text-slate-300 hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-indigo-400 transition-colors" />
                      <span className="truncate text-sm font-normal">
                        {t.title || "New Chat"}
                      </span>
                    </Link>

                    {/* Triple Dots Button */}
                    <div className="relative pr-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(isDropdownOpen ? null : index);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-200 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 rounded-lg hover:bg-slate-800 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu for Update / Delete */}
                      {isDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveDropdown(null);
                              // TODO: Connect update action later
                              console.log("Update session:", t._id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-left"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Update</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveDropdown(null);
                              // TODO: Connect delete action later
                              console.log("Delete session:", t._id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-all text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
         {/* Bottom Section: User Login Profile Info & Logout Button */}
<div className="pt-4 mt-2 border-t border-slate-900 flex flex-col gap-2.5">
  
  {/* User Profile Info Card */}
  <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800/60">
    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
      <User className="w-5 h-5 text-indigo-400" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-sm font-medium text-slate-200 truncate">
        {user?.name || "User"}
      </span>
      <span className="text-xs text-slate-500 truncate">
        {user?.email || "user@gmail.com..."}
      </span>
    </div>
  </div>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 rounded-xl text-xs font-medium transition-all active:scale-[0.98]"
  >
    <LogOut className="w-4 h-4" />
    <span>Logout</span>
  </button>

</div>
      </aside>
    </>
  );
};

export default SideBar;

