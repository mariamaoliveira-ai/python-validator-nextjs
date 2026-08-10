import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import SubmissionDetails from './SubmissionDetails'
import { getSubmissionDetails } from '../../lib/validatorApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('../../lib/validatorApi')

function renderWithClient(ui: React.ReactElement) {
    const testQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    return render(
        <QueryClientProvider client={testQueryClient}>
            {ui}
        </QueryClientProvider>
    )
}

describe('SubmissionDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders submission details when data is returned', async () => {
        const mocked = vi.mocked(getSubmissionDetails)
        mocked.mockResolvedValueOnce({
            id: '1',
            student_name: 'Jane Doe',
            file_name: 'sum.py',
            status: 'Executed',
            created_at: '2026-01-01T00:00:00Z',
            stdout: '3',
            stderr: '',
        })

        renderWithClient(<SubmissionDetails id="1" />)

        expect(await screen.findByText(/Submission Details/i)).toBeInTheDocument()
        expect(screen.getByText(/Student: Jane Doe/i)).toBeInTheDocument()
        expect(screen.getByText(/File: sum.py/i)).toBeInTheDocument()
        expect(screen.getByText(/Status: Executed/i)).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('shows error message when query fails', async () => {
        const mocked = vi.mocked(getSubmissionDetails)
        mocked.mockRejectedValueOnce(new Error('Not found'))

        renderWithClient(<SubmissionDetails id="2" />)

        expect(await screen.findByText(/Error loading submission details/i)).toBeInTheDocument()
    })
})
