import SingleLearningPlan from "@/components/pages/OneLearningPage";

async function page({ params }: { params: Promise<{ learning: string }> }) {
  const { learning } = await params;
  return (
    <div>
      <SingleLearningPlan id={learning} />
    </div>
  );
}

export default page;
