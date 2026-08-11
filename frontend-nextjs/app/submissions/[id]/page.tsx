import SubmissionDetails from "@/components/submission-details/SubmissionDetails";

interface SubmissionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionPage({ params } : SubmissionPageProps) {
  const { id } = await params;

  return (
    <div>
      <SubmissionDetails id={id} />
    </div>
  );
}