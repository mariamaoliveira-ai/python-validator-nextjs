'use client'

import { useAuth } from "@/lib/login";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const { logout, user } = useAuth();

    function handleLogout(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        logout();
        router.push('/login');
    }

    return (
        <div className="flex gap-4 mt-5">
            <div className="flex-1 font-bold">
                Welcome {user}!
            </div>
            <Button onClick={handleLogout}
                variant="contained"
                color="error"
                data-testid="logout-button"
                className=""
            >
                Logout
            </Button>
        </div>
    );

}