"use client"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, User, Building } from "lucide-react"
import Head from "next/head"

const Signup = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name")
      return
    }

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

    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy")
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage("Account created successfully! Redirecting...")

      setTimeout(() => {
      }, 1000)
    } catch (error) {
      setErrorMessage("An error occurred while creating your account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up | MarsAI</title>
        <meta name="description" content="Create your MarsAI account to access powerful GenAI tools" />
      </Head>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="fixed inset-0 z-0 overflow-hidden bg-black bg-[url('/hero-pattern.png')]">
          <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-genai-purple/10 filter blur-3xl animate-float opacity-50" />
          <div
            className="absolute top-[40%] right-[5%] w-96 h-96 rounded-full bg-blue-500/5 filter blur-3xl animate-float opacity-40"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[15%] left-[20%] w-80 h-80 rounded-full bg-purple-500/10 filter blur-3xl animate-float opacity-30"
            style={{ animationDelay: "4s" }}
          />

          <div className="hidden lg:block absolute inset-0 z-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#smallGrid)" />

              <circle cx="10%" cy="20%" r="2" fill="#9b87f5" />
              <circle cx="30%" cy="15%" r="2" fill="#9b87f5" />
              <circle cx="20%" cy="40%" r="2" fill="#9b87f5" />
              <circle cx="40%" cy="50%" r="2" fill="#9b87f5" />
              <circle cx="70%" cy="30%" r="2" fill="#9b87f5" />
              <circle cx="80%" cy="70%" r="2" fill="#9b87f5" />
              <circle cx="65%" cy="65%" r="2" fill="#9b87f5" />
              <circle cx="30%" cy="80%" r="2" fill="#9b87f5" />

              <line x1="10%" y1="20%" x2="30%" y2="15%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="30%" y1="15%" x2="20%" y2="40%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="20%" y1="40%" x2="40%" y2="50%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="40%" y1="50%" x2="70%" y2="30%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="70%" y1="30%" x2="80%" y2="70%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="80%" y1="70%" x2="65%" y2="65%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="65%" y1="65%" x2="30%" y2="80%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
              <line x1="30%" y1="80%" x2="10%" y2="20%" stroke="#9b87f5" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-xl p-6 sm:p-8 backdrop-blur-lg">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-12 flex items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-full h-full bg-genai-purple/30 rounded-full blur-md animate-pulse-slow"></div>
                      <div className="relative z-10 font-bold text-white flex items-center space-x-1">
                        <div className="bg-gradient-to-br from-genai-purple-light to-genai-purple-dark p-1.5 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        </div>

                        <span className="font-semibold text-2xl">
                          Mars<span className="text-genai-purple-light">AI</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-blue-100">Create your account</h1>
              <p className="mt-2 text-center text-gray-200">
                Join MarsAI and unlock powerful GenAI tools for your business
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                <p>{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-400">
                <p>{successMessage}</p>
              </div>
            )}

            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 h-10 rounded-md bg-black border border-gray-500 focus:border-genai-purple focus:ring-genai-purple text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 h-10 rounded-md bg-black border border-gray-500 focus:border-genai-purple focus:ring-genai-purple text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-gray-300">
                    Company (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Building size={18} />
                    </div>
                    <input
                      id="company"
                      type="text"
                      placeholder="Enter your company name"
                      className="w-full pl-10 h-10 rounded-md bg-black border border-gray-500 focus:border-genai-purple focus:ring-genai-purple text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full pl-10 h-10 rounded-md bg-black border border-gray-500 focus:border-genai-purple focus:ring-genai-purple text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full pl-10 h-10 rounded-md bg-black border border-gray-500 focus:border-genai-purple focus:ring-genai-purple text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 border-gray-600 rounded bg-black text-genai-purple focus:ring-genai-purple"
                  />
                  <label htmlFor="agree-terms" className="text-sm text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-genai-purple-light hover:text-genai-purple hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-genai-purple-light hover:text-genai-purple hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full justify-center border border-white items-center h-10 px-4 py-2 rounded-md bg-genai-purple hover:bg-genai-purple-dark text-white font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </button>

                <div className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <a href="#" className="font-medium text-genai-purple-light hover:text-genai-purple hover:underline">
                    Sign in
                  </a>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-300">
            <p>© 2025 CloudAI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup