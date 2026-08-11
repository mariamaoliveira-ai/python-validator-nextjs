import { render, screen, waitFor } from '@testing-library/react'
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
            status: 'SUCCESS',
            created_at: '2026-01-01T00:00:00Z',
            stdout: '3',
            stderr: '',
        })

        renderWithClient(<SubmissionDetails id="1" />)

        await waitFor(() => {
            expect(screen.getByText(/Student:/i)).toBeInTheDocument()
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
            expect(screen.getByText('sum.py')).toBeInTheDocument()
            expect(screen.getByText('SUCCESS')).toBeInTheDocument()
        })
    })

    it('shows error message when query fails', async () => {
        const mocked = vi.mocked(getSubmissionDetails)
        mocked.mockRejectedValueOnce(new Error('Not found'))

        renderWithClient(<SubmissionDetails id="2" />)

        expect(await screen.findByText(/Error loading submission details/i)).toBeInTheDocument()
    })
})
