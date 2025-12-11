import { BookOpen, BrainCircuit, Compass, Layers } from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Curated 'Best-of' Resources",
    description:
      "We don't just search Google. Our AI ranks resources based on expertise, currency, and community endorsement so you only learn from top-tier material.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Summaries",
    description:
      "Short on time? Get personalized AI summaries of long articles or videos, tailored specifically to your current knowledge level and goal.",
  },
  {
    icon: Layers,
    title: "Dynamic Adaptation",
    description:
      "The roadmap breathes. Find a topic too easy? The AI accelerates the path. Struggling? It adds supportive remedial steps automatically.",
  },
  {
    icon: BookOpen,
    title: "Goal-Oriented Outcomes",
    description:
      "Whether you want to pass an interview, build a project, or teach others, the roadmap structure adjusts to ensure you reach that specific outcome.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            More than just links. A learning engine.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <feature.icon className="h-10 w-10 text-indigo-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
