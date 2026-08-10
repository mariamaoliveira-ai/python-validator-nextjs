import DashboardHeader from "@/components/dashboard-header/DashboardHeader";
import SubmissionForm from "@/components/submission-form/SubmissionForm";
import SubmissionTable from "@/components/submission-table/SubmissionTable";
import { getQueryClient } from "@/lib/get-query-client";
import { Submission, getSubmissions } from "@/lib/validatorApi";


export default async function DashboardPage() {

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <DashboardHeader />

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">{ }
        <SubmissionForm />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">{ }
        <SubmissionTable/>
      </section>
    </div>
  );
}


