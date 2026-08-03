import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SubmissionTable from './SubmissionTable'

const fakeSubmissions = [
  {
    student_name: 'John Doe',
    file_name: 'solution.py',
    status: 'SUCCESS',
    result_execution: 'Executed successfully',
    created_at: '2026-07-23 17:21:09.976010',
  },
  {
    student_name: 'John Doe',
    file_name: 'solution_2.py',
    status: 'FAILED',
    result_execution: 'An error occurred during execution',
    created_at: '2026-07-23 17:21:09.976010',
  },
];

const emptySubmissions: any[] = [];

describe('SubmissionTable', () => {

    describe('When user loads the page', () =>{
        it('should render table with headers and rows if there are submissions', ()=>{
            render(<SubmissionTable submissions={fakeSubmissions}/>)

            expect(screen.getByRole('table')).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /student name/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /file name/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /result execution/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /created at/i })).toBeInTheDocument()

            expect(screen.getByRole('row', { name: /john doe solution.py success executed successfully 23-07-2026 17:21:09/i })).toBeInTheDocument()
            expect(screen.getByRole('row', { name: /john doe solution_2.py failed an error occurred during execution 23-07-2026 17:21:09/i })).toBeInTheDocument()
        });

        it('should render text in green if status is SUCCESS and in red if status is FAILURE', ()=>{
            render(<SubmissionTable submissions={fakeSubmissions}/>)

            expect(screen.getByText('SUCCESS')).toHaveClass('text-green-800')
            expect(screen.getByText('FAILED')).toHaveClass('text-red-800')
        });

        it('It show a message if there are no submissions', ()=>{
            render(<SubmissionTable submissions={emptySubmissions}/>)

            expect(screen.getByText(/no submissions found/i)).toBeInTheDocument()
        });
    })
})