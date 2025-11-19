"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import InputField from "./InputField";
import Link from "next/link";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  forgotPasswordLink?: string;
  role: "admin" | "instructor" | "staff" | "student";
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle = "Enter your email and password to sign in!",
  forgotPasswordLink,
  role,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form fields
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (!password.trim()) {
        throw new Error("Password is required");
      }

      // Map instructor to teacher for backend compatibility
      const backendRole = role === "instructor" ? "teacher" : role;

      await auth.loginUser(email, password, backendRole as any);
    } catch (error: any) {
      console.error("AuthForm - Login error:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        // HTTP error responses
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage =
            "Invalid credentials. Please check your email and password.";
        } else if (status === 403) {
          errorMessage = `Access denied. You don't have ${role} privileges.`;
        } else if (status === 404) {
          errorMessage = "Account not found. Please contact administrator.";
        } else if (data?.msg) {
          errorMessage = data.msg;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message) {
        // Other errors (validation, role mismatch, etc.)
        errorMessage = error.message;
      }

      // Additional role-specific error messages
      if (errorMessage.includes("Invalid Credentials")) {
        errorMessage += ` Make sure you're using the correct ${role} account credentials.`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    if (password) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-sm mb-4 text-gray-700 block hover:text-blue-600 transition-colors"
          >
            &lt; Back to Home
          </Link>
          <h2 className="text-2xl sm:text-3xl mb-1 font-bold text-gray-800">
            {title}
          </h2>
          <p className="text-black mb-6 text-sm sm:text-base">{subtitle}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Email*"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
            />

            <div>
              <label className="block text-gray-700 font-medium text-sm sm:text-base">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pr-10 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    password
                      ? "text-gray-600 hover:text-gray-800 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  } transition-colors`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={!password}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {forgotPasswordLink && (
              <div className="flex justify-end">
                <Link
                  href={forgotPasswordLink}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 justify-center bg-blue-800 flex text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? (
                <div className="flex items-center">
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
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Make sure you're using the correct {role}{" "}
                account credentials.
                {role === "admin" &&
                  " Only administrators can access this portal."}
                {role === "staff" &&
                  " Only staff members can access this portal."}
                {role === "student" && " Only students can access this portal."}
                {role === "instructor" &&
                  " Only instructors/teachers can access this portal."}
              </p>
            </div>
          </form>

          {/* Demo credentials hint */}
          {/* <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Tip:</strong> Ensure your backend is running on{" "}
              <code className="bg-gray-100 px-1 rounded">
                http://localhost:5000
              </code>{" "}
              and check browser console for detailed error messages if login
              fails.
            </p>
          </div> */}
        </div>
      </div>

      {/* Right side with graphics */}
      <div className="w-full lg:w-1/2 text-white flex flex-col bg-[#00A8b5] p-4 sm:p-8 relative rounded-bl-[60px] sm:rounded-bl-[150px] lg:rounded-bl-[200px] min-h-[40vh] lg:min-h-screen">
        <div className="mb-4 px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="inline-block mb-2 bg-amber-400 text-black px-2 rounded">
              Smart
            </span>
            <br />
            <span className="inline-block mb-2">Solutions,</span>
            <br />
            <span className="inline-block mb-2 bg-amber-400 text-black px-2 rounded">
              Scalable
            </span>
            <br />
            <span className="inline-block mb-2">Success</span>
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 sm:gap-8 md:gap-10">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="h-24 sm:h-36 md:h-48 w-24 sm:w-36 md:w-48 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <img
                  src="/image.png"
                  alt="p2pclouds"
                  className="h-full w-full object-cover rounded-full p-2"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <p className="mt-2 sm:mt-4 text-xs sm:text-base md:text-xl bg-white rounded-full text-black px-3 sm:px-4 py-1">
                🌐www.p2pclouds.net
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-24 sm:h-36 md:h-48 w-24 sm:w-36 md:w-48 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <img
                  src="/image.png"
                  alt="mabsol"
                  className="h-full w-full object-cover rounded-full p-2"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <p className="mt-2 sm:mt-4 text-xs sm:text-base md:text-xl bg-white rounded-full text-black px-3 sm:px-4 py-1">
                🌐www.mabsoltech.com
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-8 text-center">
            <p className="text-xs sm:text-base md:text-xl bg-white rounded-full text-black px-3 sm:px-4 py-1">
              📧hi@mianahmadbasit.xyz
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
