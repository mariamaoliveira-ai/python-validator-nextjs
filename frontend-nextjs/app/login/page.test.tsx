import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import LoginPage from './page'

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

const mockLogin = vi.fn();
vi.mock('@/lib/login', () => ({
    useAuth: () => ({
        user: null,
        login: mockLogin,
        logout: vi.fn(),
    }),
}));

describe('Login Page', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render username and password fields and login button', ()=>{
        render(<LoginPage/>)

        expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    });

    it('should submit the login form when the login button is clicked', async ()=>{
        const user = userEvent.setup()
        mockLogin.mockReturnValue(true)

        render(<LoginPage/>)

        const usernameInput = screen.getByRole('textbox', { name: /username/i })
        const passwordInput = screen.getByLabelText(/password/i)
        const loginButton = screen.getByRole('button', { name: /login/i })

        await user.type(usernameInput, 'testuser')
        await user.type(passwordInput, 'testpassword')
        await user.click(loginButton)

        expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpassword')
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
    });

    it('should show an alert when login fails', async ()=>{
        const user = userEvent.setup()
        mockLogin.mockReturnValue(false)

        render(<LoginPage/>)

        const usernameInput = screen.getByRole('textbox', { name: /username/i })
        const passwordInput = screen.getByLabelText(/password/i)
        const loginButton = screen.getByRole('button', { name: /login/i })

        await user.type(usernameInput, 'wronguser')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(loginButton)

        expect(mockLogin).toHaveBeenCalledWith('wronguser', 'wrongpassword')
        expect(mockPush).not.toHaveBeenCalled()
        expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
    });
        
});