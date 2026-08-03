import SubmissionForm from "../components/submission-form/SubmissionForm";
import SubmissionTable from "../components/submission-table/SubmissionTable";
import { getSubmissions, Submission } from "../lib/validatorApi";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function orderSubmissionsByDate(submissions: Submission[]): Submission[] {
    return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

export default async function Home() {

  const submissions = orderSubmissionsByDate(await getSubmissions());

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-8"> 
        <h1 className="text-3xl font-bold text-blue-600">
          Python Validator
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Submit your Python file to check your solution
        </p>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">{}
        <SubmissionForm/>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">{}
        <SubmissionTable submissions={submissions} />
      </section>
    </div>
  );
}
