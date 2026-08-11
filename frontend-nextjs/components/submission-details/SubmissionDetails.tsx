'use client';

import { useQuery } from "@tanstack/react-query";
import { getSubmissionDetails } from "@/lib/validatorApi";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, Typography, Box, LinearProgress, Alert } from '@mui/material';



export default function SubmissionPage({ id }: { id: string }) {

    const { data: submissionDetails, isLoading, isError } = useQuery({
        queryKey: ['submissionDetails', id],
        queryFn: () => getSubmissionDetails(id)
    });

    // Basic Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Box sx={{ width: '50%' }}>
                    <LinearProgress color="primary" />
                    <Typography variant="body2" color="text.secondary" className="mt-2 text-center">
                        Loading submission details...
                    </Typography>
                </Box>
            </div>
        );
    }

    // Basic Error state
    if (isError || !submissionDetails) {
        return (
            <div className="flex justify-center mt-10">
                <Alert severity="error" variant="filled">
                    Error loading submission details.
                </Alert>
            </div>
        );
    }

    // A shared style for the metadata label and value pairs
    const MetaItem = ({ label, value }: { label: string; value: string }) => (
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-x-4">
            <dt className="text-sm font-semibold text-gray-900 w-full sm:w-28 text-left">{label}:</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:mt-0 font-medium">{value}</dd>
        </div>
    );

    return (
        <div className= "mt-10">
            {/* MUI Card for the entire section, with spacing and elevation */}
            <Card variant="outlined" className="max-w-7xl mx-auto rounded-xl shadow-md">
                <CardHeader
                    className="p-6 md:px-8 border-b border-gray-100"
                    title={
                        <Typography variant="h5" component="h1" className="font-bold text-gray-950">
                            Submission Details: <span data-testid="detail-file-name" className="font-mono text-xl text-blue-800 bg-blue-50 px-3 py-1 rounded-md">{submissionDetails.file_name}</span>
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" className="text-gray-600 mt-1">
                            Detailed execution report for this file.
                        </Typography>
                    }
                />

                <CardContent className="p-6 md:p-8 space-y-6">
                    {/* Metadata Section - Structured similar to the table rows */}
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <MetaItem label="Student" value={submissionDetails.student_name} />
                        <div className="flex items-center gap-x-4">
                            <span className="text-sm font-semibold text-gray-900 w-full sm:w-28 text-left">Status:</span>
                            <span className={
                                `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${submissionDetails.status === 'SUCCESS'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`
                            }>
                            {submissionDetails.status}
                            </span>
                        </div>
                        <MetaItem label="Created At" value={format(new Date(submissionDetails.created_at), 'dd-MM-yyyy HH:mm:ss')} />
                    </dl>
     

                    {/* The primary content area */}
                    <div className="space-y-6">

                        {/* Output Section */}
                        <section>
                            <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                                Standard Output (stdout)
                            </Typography>
                            {/* Tailwind for pre styling, using theme-like gray */}
                            <pre className="bg-gray-100/50 text-gray-900 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap border border-gray-200">
                                {submissionDetails.stdout || <span className="italic text-gray-500">None</span>}
                            </pre>
                        </section>

                        {/* Error Section */}
                        <section>
                            <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                                Standard Error (stderr)
                            </Typography>
                            {/* Tailwind for red/pre styling, similar to the FAILED status row */}
                            <pre className="bg-red-50 text-red-900 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap border border-red-100">
                                {submissionDetails.stderr || <span className="italic text-gray-500">None</span>}
                            </pre>
                        </section>

                        {/* Error Message */}
                        <section>
                            <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                                Error Message
                            </Typography>
                            {/* Tailwind for red/pre styling, similar to the FAILED status row */}
                            <pre className="bg-red-50 text-red-900 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap border border-red-100">
                                {submissionDetails.error_message || <span className="italic text-gray-500">None</span>}
                            </pre>
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}