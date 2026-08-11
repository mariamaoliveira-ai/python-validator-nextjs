"use client";

import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useRouter} from 'next/navigation'
import { useState } from 'react'
import { submitValidation, ValidationRequest } from '../../lib/validatorApi'
import { useMutation, useQueryClient } from '@tanstack/react-query';


function SubmissionForm({ onSubmitComplete }: { onSubmitComplete?: () => void }) {

    const router = useRouter()

    const [studentName, setStudentName] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [fileInputKey, setFileInputKey] = useState(0)
    const [responseMessage, setResponseMessage] = useState('')
    const [statusMessage, setStatusMessage] = useState<'success' | 'error'>('success')

    const queryClient = useQueryClient()
    const {mutate, isPending} = useMutation({
        mutationFn: (payload: ValidationRequest) => submitValidation(payload),
        onSuccess: (data) => {
            setStatusMessage('success')
            setResponseMessage(data.message)
            queryClient.invalidateQueries({ queryKey: ['submissions'] })
        },
        onError: (error: any) => {
            setStatusMessage('error')
            setResponseMessage(`Submission Failed: ${error.message}`)
            queryClient.invalidateQueries({ queryKey: ['submissions'] })
        },
        onSettled: () => {
            setStudentName('')
            setFile(null)
            setFileInputKey(k => k + 1)
            onSubmitComplete?.()
        }
    })

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        mutate({ studentName, file: file! })
    }
    

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Submit Your Solution</h2> 
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    {responseMessage && (
                        <Alert 
                            severity={statusMessage}
                            onClose={() => setResponseMessage('')}
                        >
                        {responseMessage}
                        </Alert>
                    )}

                    <TextField 
                        id="student-input" 
                        label="Student Name" 
                        variant="outlined" 
                        name="studentName"
                        value={studentName}
                        onChange={(event) => setStudentName(event.target.value)}
                    />
                    <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                    <CloudUploadIcon className="text-slate-400 mb-2" sx={{ fontSize: 32 }} />
                    <span className="text-sm text-slate-500">
                        {file ? file.name : 'Click to upload a .py file'}
                    </span>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".py"
                        className="hidden"
                        onChange={(event) => setFile(event.target.files ? event.target.files[0] : null)}
                        key={fileInputKey}
                        data-testid="file-upload"
                    />
                    </label>
                    <Button 
                        variant="contained"
                        type="submit"
                        name="submit"
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                </Stack>
            </Box>
        </div>
    )

}

export default SubmissionForm;