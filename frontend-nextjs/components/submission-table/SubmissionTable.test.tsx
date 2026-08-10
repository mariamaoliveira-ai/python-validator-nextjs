import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SubmissionTable from './SubmissionTable'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSubmissions } from '@/lib/validatorApi';
import { vi } from 'vitest';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/validatorApi', () => ({
  getSubmissions: vi.fn(),
}));

const fakeSubmissions = [
  {
    id: '1',
    student_name: 'John Doe',
    file_name: 'solution.py',
    status: 'SUCCESS',
    created_at: '2026-07-23 17:21:09.976010',
  },
  {
    id: '2',
    student_name: 'John Doe',
    file_name: 'solution_2.py',
    status: 'FAILED',
    created_at: '2026-07-23 17:21:09.976010',
  },
];

const emptySubmissions: any[] = [];

function renderWithClient(ui: React.ReactElement) {
    const testQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disables retries so tests fail immediately on error
            },
        },
    })
    
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>
            {ui}
        </QueryClientProvider>
    )
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>
                    {rerenderUi}
                </QueryClientProvider>
            ),
    }
}

describe('SubmissionTable', () => {

    describe('When user loads the page', () =>{
        it('should render table with headers and rows if there are submissions', async ()=>{
            vi.mocked(getSubmissions).mockResolvedValueOnce(fakeSubmissions)
            
            renderWithClient(<SubmissionTable/>)

            expect(await screen.findByRole('table')).toBeInTheDocument()    
                    
            expect(screen.getByRole('columnheader', { name: /student name/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /file name/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /created at/i })).toBeInTheDocument()
            expect(screen.getByRole('columnheader', { name: /details/i })).toBeInTheDocument()

            expect(screen.getByRole('row', { name: /john doe solution.py success 23-07-2026 17:21:09 details/i })).toBeInTheDocument()
            expect(screen.getByRole('row', { name: /john doe solution_2.py failed 23-07-2026 17:21:09 details/i })).toBeInTheDocument()
        });

        it('should render text in green if status is SUCCESS and in red if status is FAILURE', async ()=>{
            vi.mocked(getSubmissions).mockResolvedValueOnce(fakeSubmissions)
            renderWithClient(<SubmissionTable/>)

            expect(await screen.findByText('SUCCESS')).toHaveClass('text-green-800')
            expect(await screen.findByText('FAILED')).toHaveClass('text-red-800')
        });

        it('It show a message if there are no submissions', async ()=>{
            vi.mocked(getSubmissions).mockResolvedValueOnce(emptySubmissions)
            renderWithClient(<SubmissionTable/>)

            expect(await screen.getByText(/no submissions found/i)).toBeInTheDocument()
        });
    })
})