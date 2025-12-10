import { SignupForm } from "@/components/auth/signup-form";
import { CircleDot, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Website Details */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <CircleDot className="h-8 w-8" />
            <span className="text-2xl font-bold">QuizLander</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Start creating quizzes today
            </h1>
            <p className="text-slate-400 text-lg">
              Join thousands of educators and content creators who use QuizLander to build interactive quizzes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">Free to get started</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">No credit card required</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">Create unlimited quizzes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">Share with anyone, anywhere</span>
            </div>
          </div>
        </div>

        <div className="text-slate-500 text-sm">
          © {new Date().getFullYear()} QuizLander. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <CircleDot className="h-7 w-7 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">QuizLander</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
            <p className="text-slate-600">Get started with QuizLander for free</p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}
