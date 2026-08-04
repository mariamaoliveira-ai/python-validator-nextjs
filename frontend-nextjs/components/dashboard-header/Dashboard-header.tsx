'use client'

import { useAuth } from "@/lib/login";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        logout();
        router.push('/login');
    }

    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
                Python Validator
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Welcome {user}! Submit your Python file to check your solution.
            </p>
            <div>
                <Button onClick={handleLogout}
                    variant="contained"
                    color="error"
                >
                    Logout
                </Button>
            </div>
        </header>
    );
}