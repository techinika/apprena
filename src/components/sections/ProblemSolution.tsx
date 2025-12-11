import { APP } from "@/variables/globals";
import { Ban, CheckCircle } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Is your learning journey chaotic?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Do you spend more time figuring out *what* to learn than actually
            learning?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-red-50 w-24 h-24 rounded-full flex items-center justify-center">
              <Ban className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Old Way
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Ban className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Information overload: Dozens of tabs open with outdated
                  tutorials.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Ban className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  No clear direction: Jumping randomly between YouTube videos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Ban className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Quality uncertainty: Is this 2-hour course actually good?
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-500 w-24 h-24 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-indigo-200" />
            </div>
            <h3 className="text-2xl font-bold mb-6">The {APP?.NAME} AI Way</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-indigo-200 flex-shrink-0 mt-0.5" />
                <span>
                  Curated Excellence: AI finds the &quot;best of the best&quot;
                  resources tailored to you.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-indigo-200 flex-shrink-0 mt-0.5" />
                <span>
                  Adaptive Roadmaps: A step-by-step plan that evolves as you
                  learn.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-indigo-200 flex-shrink-0 mt-0.5" />
                <span>
                  Hyper-Focused: AI summaries and goal-oriented steps save hours
                  of time.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
