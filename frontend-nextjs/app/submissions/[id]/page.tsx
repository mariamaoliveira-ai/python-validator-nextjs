import SubmissionDetails from "@/components/submission-details/SubmissionDetails";

export default async function SubmissionPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <h1>Submission Details</h1>
      <SubmissionDetails id={id} />
    </div>
  );
}