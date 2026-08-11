import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import SubmissionForm from './SubmissionForm'
import { submitValidation } from '../../lib/validatorApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockPush = vi.fn()

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

vi.mock('../../lib/validatorApi')

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

describe('SubmissionForm', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('When user submits valid form', ()=>{

        it('should render name text field, file input and submit button when component loads', ()=>{
            renderWithClient(<SubmissionForm/>)

            expect(screen.getByRole('textbox', { name: /student name/i })).toBeInTheDocument()
            expect(screen.getByTestId('file-upload')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
        });


        it('should show success message when form is submitted successfully', async ()=>{
            const user = userEvent.setup()
            const mockedSubmit = vi.mocked(submitValidation)

            mockedSubmit.mockResolvedValueOnce({     
                message: 'File received: hello.py',
                execution_status: 'Executed',
            })

            renderWithClient(<SubmissionForm/>)

            const nameInput = screen.getByRole('textbox', { name: /student name/i })
            const fileInput = screen.getByTestId('file-upload')
            const submitButton = screen.getByRole('button', { name: /submit/i })
            
            await user.type(nameInput, 'John Doe')
            await user.upload(fileInput, new File(['print("Hello World")'], 'hello.py', { type: 'text/x-python' }))
            await user.click(submitButton)
            
            expect(mockedSubmit).toHaveBeenCalledWith({
                studentName: 'John Doe',
                file: expect.any(File),
            })
            
            const alert = await screen.findByRole('alert')
            expect(await screen.findByText(/file received: hello.py/i)).toBeInTheDocument()
            expect(alert).toHaveClass('MuiAlert-colorSuccess')
        });


        it('should call onSubmitComplete when form is submitted successfully', async ()=>{
            const user = userEvent.setup()
            const mockedSubmit = vi.mocked(submitValidation)
            const onSubmitComplete = vi.fn()

            mockedSubmit.mockResolvedValueOnce({
                message: 'File received: hello.py',
                execution_status: 'Executed',
            })

            renderWithClient(<SubmissionForm/>)

            await user.type(screen.getByRole('textbox', { name: /student name/i }), 'John Doe')
            await user.upload(screen.getByTestId('file-upload'), new File(['print("Hello World")'], 'hello.py', { type: 'text/x-python' }))
            await user.click(screen.getByRole('button', { name: /submit/i }))
        });

        it('should call onSubmitComplete even when form submission fails', async ()=>{
            const user = userEvent.setup()
            const mockedSubmit = vi.mocked(submitValidation)
            const onSubmitComplete = vi.fn()

            mockedSubmit.mockRejectedValueOnce(new Error('Execution failed with error: SyntaxError: invalid syntax'))

            renderWithClient(<SubmissionForm/>)

            await user.type(screen.getByRole('textbox', { name: /student name/i }), 'John Doe')
            await user.upload(screen.getByTestId('file-upload'), new File(['print("Hello World"'], 'hello.py', { type: 'text/x-python' }))
            await user.click(screen.getByRole('button', { name: /submit/i }))
        });

        it('should show error message when form submission fails', async ()=>{
            const user = userEvent.setup()
            const mockedSubmit = vi.mocked(submitValidation)

            mockedSubmit.mockRejectedValueOnce(new Error('Execution failed with error: SyntaxError: invalid syntax'))

            renderWithClient(<SubmissionForm/>)

            const nameInput = screen.getByRole('textbox', { name: /student name/i })
            const fileInput = screen.getByTestId('file-upload')
            const submitButton = screen.getByRole('button', { name: /submit/i })

            await user.type(nameInput, 'John Doe')
            await user.upload(fileInput, new File(['print("Hello World"'], 'hello.py', { type: 'text/x-python' }))
            await user.click(submitButton)

            expect(mockedSubmit).toHaveBeenCalledWith({
                studentName: 'John Doe',
                file: expect.any(File),
            })

            const alert = await screen.findByRole('alert')
            expect(await screen.findByText(/execution failed with error/i)).toBeInTheDocument()
            expect(alert).toHaveClass('MuiAlert-colorError')
        });
    });
});