"use client";
import React from "react";
const LoginPage = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "http://localhost:5000/api/v1/auth/google";
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div 
        className="text-center text-2xl font-semibold px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer shadow-md hover:bg-blue-700 transition" 
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </div>
    </div>
  );
};

export default LoginPage;