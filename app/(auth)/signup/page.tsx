"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { authService } from "../../services/auth"
import { useRouter } from "next/navigation"

const Register: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          await authService.getCurrentUser()
          router.replace("/chat")
        }
      } catch (error) {
        console.log(error)
      }
    }

    checkAuth()
  }, [router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setErrorMessage("Please enter your email address")
      return
    }

    if (!password) {
      setErrorMessage("Please enter your password")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

    setIsLoading(true)

    try {
      await authService.register({ email, password, name })
      setSuccessMessage("Registration successful! Redirecting to login...")
      setTimeout(() => {
        router.replace("/login")
      }, 2000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Registration failed. Please try again.")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f5f2]">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#c1440e] to-[#8c3503] p-8 flex-col justify-between">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-[#c1440e]"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="ml-2 text-2xl font-bold text-white">
            Mars<span className="text-[#ffd166]">AI</span>
          </span>
        </div>

        <div className="my-auto max-w-md mx-auto text-center">
          <div className="mb-8">

          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Join MarsAI Today</h1>
          <p className="text-white/90 text-lg">
            Create your account and start exploring technology made simple with AI assistance.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-medium text-white">Easy to Use</h3>
              <p className="text-white/80 text-sm">Simple interface for everyone</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-medium text-white">Helpful</h3>
              <p className="text-white/80 text-sm">Get answers in plain language</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-medium text-white">Reliable</h3>
              <p className="text-white/80 text-sm">Always there when you need help</p>
            </div>
          </div>
        </div>

        <div className="text-white/70 text-sm">© 2025 MarsAI. All rights reserved.</div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-[#f8f5f2]">
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex items-center">
              <div className="bg-[#c1440e] p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="ml-2 text-2xl font-bold text-[#5c2c06]">
                Mars<span className="text-[#c1440e]">AI</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#e6ddd6]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#5c2c06]">Create Account</h2>
              <p className="text-[#8c6d62] mt-2">Join MarsAI and get started</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-[#fde8e8] border-l-4 border-[#e53e3e] text-[#c53030]">
                <div className="flex">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-[#f0fff4] border-l-4 border-[#48bb78] text-[#2f855a]">
                <div className="flex">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#5c2c06] mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62]">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 py-3 border border-[#e6ddd6] rounded-lg focus:ring-2 focus:ring-[#c1440e] focus:border-[#c1440e] bg-[#fdfcfb] text-[#5c2c06]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5c2c06] mb-1">
                  Email Address*
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62]">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 py-3 border border-[#e6ddd6] rounded-lg focus:ring-2 focus:ring-[#c1440e] focus:border-[#c1440e] bg-[#fdfcfb] text-[#5c2c06]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#5c2c06] mb-1">
                  Password*
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62]">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 py-3 border border-[#e6ddd6] rounded-lg focus:ring-2 focus:ring-[#c1440e] focus:border-[#c1440e] bg-[#fdfcfb] text-[#5c2c06]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62] hover:text-[#5c2c06]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5c2c06] mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62]">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 py-3 border border-[#e6ddd6] rounded-lg focus:ring-2 focus:ring-[#c1440e] focus:border-[#c1440e] bg-[#fdfcfb] text-[#5c2c06]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c6d62] hover:text-[#5c2c06]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${isLoading
                  ? "bg-[#e07a4c] cursor-not-allowed"
                  : "bg-[#c1440e] hover:bg-[#8c3503] shadow-md hover:shadow-lg"
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-[#8c6d62]">
                  Already have an account?{" "}
                  <a href="/login" className="font-medium text-[#c1440e] hover:text-[#8c3503]">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-[#8c6d62] md:hidden">
            <p>By creating an account, you agree to our</p>
            <p className="mt-1">
              <a href="#" className="text-[#c1440e] hover:text-[#8c3503]">
                Terms of Service
              </a>
              {" and "}
              <a href="#" className="text-[#c1440e] hover:text-[#8c3503]">
                Privacy Policy
              </a>
            </p>
            <p className="mt-4">© 2025 MarsAI. All rights reserved.</p>
          </div>

          <div className="hidden md:block mt-8 text-center text-xs text-[#8c6d62]">
            <p>
              By creating an account, you agree to our{" "}
              <a href="#" className="text-[#c1440e] hover:text-[#8c3503]">
                Terms of Service
              </a>
              {" and "}
              <a href="#" className="text-[#c1440e] hover:text-[#8c3503]">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register