import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


import { useState } from 'react'
import { submitValidation } from '../../api/validatorApi'


function SubmissionForm({ onSubmitComplete }: { onSubmitComplete?: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [studentName, setStudentName] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [fileInputKey, setFileInputKey] = useState(0)
    const [responseMessage, setResponseMessage] = useState('')
    const [statusMessage, setStatusMessage] = useState<'success' | 'error'>('success')


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try{
            setIsLoading(true)
            const response = await submitValidation({ studentName, file: file! })
            setStatusMessage('success')
            setResponseMessage(response.message)
        }catch(error){
            setStatusMessage('error')
            setResponseMessage(`Submission Failed: ${error}`)
        }finally{
            setIsLoading(false)
            setStudentName('')
            setFile(null)
            setFileInputKey(k => k + 1)
            onSubmitComplete?.()
        }
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
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Stack>
            </Box>
        </div>
    )

}

export default SubmissionForm;