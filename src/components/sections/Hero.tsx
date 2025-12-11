"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Sending email to Firebase:", email);
    // --- FIREBASE INTEGRATION HERE ---
    // e.g., await addDoc(collection(db, "demoRequests"), { email, createdAt: serverTimestamp() });
    // ---------------------------------
    setTimeout(() => {
      alert("Thanks! We'll be in touch shortly.");
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 text-indigo-600 bg-indigo-100/60 ring-1 ring-inset ring-indigo-600/20 mb-6">
            <span className="font-semibold mr-2">New</span> The future of
            self-directed learning is here.
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Master Any Skill with a{" "}
            <span className="text-indigo-600 relative inline-block">
              Personalized AI Roadmap
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-2 w-full h-3 text-indigo-200"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.999939 9.5C58.7375 3.5 197.427 -2.50002 299 9.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {`Stop endless searching. We curate the world's best resources
            tailored specifically to your level, learning style, and career
            goals into one organized path.`}
          </p>

          {/* Email Capture Form */}
          <form
            onSubmit={handleBookDemo}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-6 py-3 text-gray-900"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70"
            >
              {isLoading ? "Booking..." : "Book a Demo"}{" "}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card
              needed
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Early access
              priority
            </span>
          </div>
        </div>

        {/* Mockup Placeholder - Replace with actual app screenshot later */}
        <div className="relative mx-auto max-w-4xl md:mt-16 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 bg-white p-2">
          <div className="bg-gray-50 rounded-xl aspect-[16/9] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10"></div>
            {/* Temporary placeholder UI representing a roadmap steps */}
            <div className="w-3/4 space-y-4 opacity-50">
              <div className="h-4 bg-indigo-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-green-400"></div>
                <div className="h-12 bg-white border shadow-sm rounded-lg flex-1"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-400"></div>
                <div className="h-12 bg-white border shadow-sm rounded-lg flex-1"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="h-12 bg-white border shadow-sm rounded-lg flex-1"></div>
              </div>
            </div>
            <span className="absolute font-bold text-gray-400 text-xl">
              [App Interface Mockup]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
