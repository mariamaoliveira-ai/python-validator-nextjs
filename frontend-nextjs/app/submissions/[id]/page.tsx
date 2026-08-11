import SubmissionDetails from "@/components/submission-details/SubmissionDetails";

export default async function SubmissionPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <SubmissionDetails id={id} />
    </div>
  );
}