'use client'

import Image from "next/image";
import SubmissionForm from "./components/submission-form/SubmissionForm";
import SubmissionTable from "./components/submission-table/SubmissionTable";
import { useEffect, useState } from "react";
import { getSubmissions, Submission } from "./api/validatorApi";

export default function Home() {

    const [submissions, setSubmissions] = useState<Submission[]>([])

  function orderSubmissionsByDate(submissions: Submission[]): Submission[] {
    return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  function fetchSubmissions() {
    getSubmissions()
    .then((data) => setSubmissions(orderSubmissionsByDate(data)))
    .catch((error) => console.error('Failed to load submissions', error))
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])
  
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
        <SubmissionForm onSubmitComplete={fetchSubmissions} />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">{}
        <SubmissionTable submissions={submissions} />
      </section>
    </div>
  );
}
