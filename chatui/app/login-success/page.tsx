"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
      router.replace("/chat");
    } else {
      router.replace("/login");
    }
  }, [token, router]);
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-xl font-medium">Login Successful! Redirecting...</p>
    </div>
  );
}