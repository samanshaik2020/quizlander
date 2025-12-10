import Link from "next/link";
import {
  PenTool,
  Share2,
  BarChart3,
  Lightbulb,
  Settings,
  Megaphone,
  Search,
  ArrowRight,
  CircleDot,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <CircleDot className="h-6 w-6" />
          <span>QuizLander</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="font-medium text-sm hover:text-slate-600 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-md transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Create Professional
          <br />
          Quizzes in Minutes
        </h1>
        <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Build engaging quizzes, share them effortlessly, and get instant
          insights. Perfect for educators, marketers, and content creators.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/signup"
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-3 rounded-md flex items-center gap-2 transition"
          >
            Start Creating Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/play/demo"
            className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-medium px-6 py-3 rounded-md transition"
          >
            Try a Demo Quiz
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-5 border border-gray-100 text-slate-700">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold mb-3">Easy to Create</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Intuitive drag-and-drop editor. Add questions, options, and
              customize your quiz in minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-5 border border-gray-100 text-slate-700">
              <Share2 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold mb-3">Share Anywhere</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Get a unique link for each quiz. Share on social media, embed on
              your website, or send via email.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-5 border border-gray-100 text-slate-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Results</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Automatic scoring and beautiful result pages. Track attempts and
              analyze performance.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[26px] left-10 right-10 h-[1px] bg-gray-200 -z-10" />

          <div className="relative bg-slate-50 pr-4">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 text-slate-800 shadow-sm">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-400 font-medium mb-1">Step 1</div>
            <h3 className="text-lg font-bold mb-2">Create</h3>
            <p className="text-sm text-slate-500">
              Build your quiz with our easy editor.
            </p>
          </div>

          <div className="relative bg-slate-50 pr-4">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 text-slate-800 shadow-sm">
              <Settings className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-400 font-medium mb-1">Step 2</div>
            <h3 className="text-lg font-bold mb-2">Customize</h3>
            <p className="text-sm text-slate-500">
              Add questions and set correct answers.
            </p>
          </div>

          <div className="relative bg-slate-50 pr-4">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 text-slate-800 shadow-sm">
              <Megaphone className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-400 font-medium mb-1">Step 3</div>
            <h3 className="text-lg font-bold mb-2">Share</h3>
            <p className="text-sm text-slate-500">
              Get a unique link to share anywhere.
            </p>
          </div>

          <div className="relative bg-slate-50 pr-4">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 text-slate-800 shadow-sm">
              <Search className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-400 font-medium mb-1">Step 4</div>
            <h3 className="text-lg font-bold mb-2">Analyze</h3>
            <p className="text-sm text-slate-500">
              View results and track performance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-gray-200/80 rounded-2xl p-12 text-center shadow-inner">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Ready to Get Started?
          </h2>
          <p className="text-slate-600 mb-8 font-medium">
            Create your first quiz in under 5 minutes. No credit card required.
          </p>
          <Link
            href="/signup"
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-3 rounded-md inline-flex items-center gap-2 transition"
          >
            Create Your First Quiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <CircleDot className="h-5 w-5" />
          QuizLander
        </div>
      </footer>
    </div>
  );
}
