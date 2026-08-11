import LogoutButton from "@/components/auth-user-info/AuthenticatedUserInfo";
import DashboardHeader from "@/components/page-header/PageHeader";
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
      <DashboardHeader actions = {<LogoutButton/>}/>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">{ }
        <SubmissionForm />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">{ }
        <SubmissionTable/>
      </section>
    </div>
  );
}


