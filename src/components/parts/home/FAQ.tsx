const faqs = [
  {
    q: "How does the AI build roadmaps?",
    a: "We analyze current industry standards and match them with high-quality educational content.",
  },
  {
    q: "Is the Workspace free?",
    a: "Every user gets a free starter workspace. Pro plans unlock unlimited storage and advanced AI mentors.",
  },
  {
    q: "Can I share my badges?",
    a: "Yes! Every badge comes with a unique QR code for LinkedIn or resume verification.",
  },
];

export const FAQSection = () => (
  <section className="py-24 px-6 max-w-4xl mx-auto">
    <h2 className="text-4xl font-black text-center mb-16">Common Questions</h2>
    <div className="space-y-6">
      {faqs.map((item, i) => (
        <div
          key={i}
          className="p-8 bg-white border border-slate-100 rounded-4xl shadow-sm"
        >
          <h4 className="font-black text-slate-900 mb-2">{item.q}</h4>
          <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  </section>
);
