"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Sending email to Firebase (Bottom CTA):", email);
    // --- FIREBASE INTEGRATION HERE ---
    // e.g., await addDoc(collection(db, "demoRequests"), { email, location: 'footer', createdAt: serverTimestamp() });
    // ---------------------------------
    setTimeout(() => {
      alert("Thanks! We'll get back to you very soon.");
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <section
      id="book-demo"
      className="py-24 bg-indigo-700 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Sparkles className="h-12 w-12 text-indigo-200 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
          Ready to stop searching and start mastering?
        </h2>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
          Join the waitlist for early access and be among the first to
          experience the future of personalized learning.
        </p>

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
            className="flex-grow rounded-full border-0 shadow-lg focus:ring-2 focus:ring-white px-6 py-4 text-gray-900 text-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg disabled:opacity-80"
          >
            {isLoading ? "Booking..." : "Book a Demo"}{" "}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
        <p className="text-indigo-200 text-sm mt-4">
          Limited spots available for early release.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
