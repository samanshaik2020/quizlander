import { LoginForm } from "@/components/auth/login-form";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">QuizLander</span>
      </Link>
      <LoginForm />
    </div>
  );
}
