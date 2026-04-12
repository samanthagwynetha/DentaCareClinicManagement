"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden login-panel-gradient">

        {/* Moving colour blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] bg-teal-700/60 blur-[120px] rounded-full pointer-events-none blob-1" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[380px] h-[380px] bg-cyan-400/40 blur-[120px] rounded-full pointer-events-none blob-2" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-emerald-400/30 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 blob-3" />
        <div className="absolute top-1/4 right-0 w-[200px] h-[200px] bg-teal-300/25 blur-[80px] rounded-full pointer-events-none" />

        {/* Content – pinned to edges */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-12">

          {/* Top-left tooth icon (styled like the * in the reference) */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 64 64" fill="currentColor">
                <path d="M22 6C16 6 10 11 10 18C10 22 11.5 25.5 12.5 28.5C14 33 14 36 13 41C12 46 12 52 16 54C20 56 22 50 24 45C25.5 41 27 38 32 38C37 38 38.5 41 40 45C42 50 44 56 48 54C52 52 52 46 51 41C50 36 50 33 51.5 28.5C52.5 25.5 54 22 54 18C54 11 48 6 42 6C39 6 36.5 7.5 34.5 9C33.5 9.7 32.8 10 32 10C31.2 10 30.5 9.7 29.5 9C27.5 7.5 25 6 22 6Z"/>
              </svg>
            </div>
          </div>

          {/* Bottom-left tagline */}
          <div>
            <p className="text-white/70 text-sm font-medium mb-3">Your clinic, simplified</p>
            <h2 className="text-white text-3xl font-extrabold leading-snug max-w-xs">
              Manage your dental clinic with clarity and confidence
            </h2>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 relative bg-white">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Dental Clinic System</h2>
            <p className="text-[14px] text-gray-500">Login to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-8 w-full">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@clinic.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors bg-gray-50/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-900">
                    Password
                  </label>
                  <a href="#" className="text-xs text-teal-600 font-medium hover:text-teal-700">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors bg-gray-50/50 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-2">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-white checked:border-teal-500 cursor-pointer transition-all"
                  />
                  <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-teal-500 scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                </div>
                <label htmlFor="remember" className="text-xs text-gray-600 font-medium cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1ebbb0] hover:bg-[#1aa39a] text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-gray-400">
              © 2026 Dental Clinic System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
