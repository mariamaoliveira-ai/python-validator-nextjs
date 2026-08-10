'use client';

import { useParams } from "next/dist/client/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionDetails } from "@/lib/validatorApi";
import { format } from 'date-fns';

export default function SubmissionPage({id}: {id: string}) {

    const {data: submissionDetails} = useQuery({
        queryKey: ['submissionDetails', id],
        queryFn: () => getSubmissionDetails(id)
    })

    return (
        <div>
            <h1>Submission Details</h1>
            {submissionDetails ? (
                <div>
                    <p>Student: {submissionDetails.student_name}</p>
                    <p>File: {submissionDetails.file_name}</p>
                    <p>Status: {submissionDetails.status}</p>
                    <p>Created At: {format(new Date(submissionDetails.created_at), 'dd-MM-yyyy HH:mm:ss')}</p>
                    <h2>Output</h2>
                    <pre>{submissionDetails.stdout}</pre>
                    <h2>Error</h2>
                    <pre>{submissionDetails.stderr}</pre>
                </div>
            ) : (
                <p>Error loading submission details</p>
            )}
        </div>
    )
    
}