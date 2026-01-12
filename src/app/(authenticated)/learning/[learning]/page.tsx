import SingleLearningPlan from "@/components/pages/OneLearningPage";
import { APP } from "@/variables/globals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ learning: string }>;
}) {
  const { learning } = await params;

  return {
    title: `Learning Path ${learning} | ${APP?.NAME}`,
    robots: { index: false, follow: false },
  };
}

async function page({ params }: { params: Promise<{ learning: string }> }) {
  const { learning } = await params;
  return (
    <div>
      <SingleLearningPlan id={learning} />
    </div>
  );
}

export default page;
