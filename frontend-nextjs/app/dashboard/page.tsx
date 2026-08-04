import DashboardHeader from "@/components/dashboard-header/Dashboard-header";
import SubmissionForm from "@/components/submission-form/SubmissionForm";
import SubmissionTable from "@/components/submission-table/SubmissionTable";
import { Submission, getSubmissions } from "@/lib/validatorApi";


function orderSubmissionsByDate(submissions: Submission[]): Submission[] {
    return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

export default async function LoginPage(){
  const submissions = orderSubmissionsByDate(await getSubmissions());

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <DashboardHeader />

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">{}
        <SubmissionForm/>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">{}
        <SubmissionTable submissions={submissions} />
      </section>
    </div>
  );
}


