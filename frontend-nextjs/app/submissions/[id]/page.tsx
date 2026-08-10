export default async function SubmissionPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <h1>Submission Details</h1>
      <p>This is the submission details page. ID: {id}</p>
    </div>
  );
}