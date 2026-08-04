import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DashboardPage from './page'
import { getSubmissions } from '../../lib/validatorApi'

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

vi.mock('../../lib/validatorApi')

const mockLogout = vi.fn();

vi.mock('@/lib/login', () => ({
    useAuth: () => ({
        user: 'Test User',
        logout: mockLogout,
        login: vi.fn(),
    }),
}));

describe('Dashboard Page', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render dashboard content', async ()=>{
   
        vi.mocked(getSubmissions).mockResolvedValueOnce([])
        const Component = await DashboardPage()
        render(Component)

        expect(await screen.findByText(/python validator/i)).toBeInTheDocument()
        expect(await screen.findByRole('button', { name: /logout/i })).toBeInTheDocument()
    });

    it('should route to the login page when logout button is clicked', async () =>{

       vi.mocked(getSubmissions).mockResolvedValueOnce([])
        const Component = await DashboardPage()
        render(Component)

        const logoutButton = await screen.findByRole('button', { name: /logout/i })
        const user = userEvent.setup()
        await user.click(logoutButton)

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled()
            expect(mockPush).toHaveBeenCalledWith('/login')
        })
    });

});