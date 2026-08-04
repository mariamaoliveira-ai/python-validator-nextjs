import { redirect } from "next/dist/client/components/navigation";
import SubmissionForm from "../components/submission-form/SubmissionForm";
import SubmissionTable from "../components/submission-table/SubmissionTable";
import { getSubmissions, Submission } from "../lib/validatorApi";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
    redirect('/login');
}
