import { Target, Map, Zap } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "1. Define Your Goal",
    description:
      'Tell the AI what you want to learn (e.g., "Website Design"), your current level, and your end goal (e.g., "Build a Portfolio").',
  },
  {
    icon: Map,
    title: "2. Get Your Roadmap",
    description:
      "Our engine builds a modular, step-by-step path populated with the best videos, articles, and examples from across the web.",
  },
  {
    icon: Zap,
    title: "3. Learn & Adapt",
    description:
      "Dive into curated resources. As you complete steps and take quick challenges, the AI adapts the future roadmap to your pace.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
            Simple Process
          </h2>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-0.5 bg-indigo-100 -z-10"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 mb-6 shadow-sm ring-4 ring-white relative z-10">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
