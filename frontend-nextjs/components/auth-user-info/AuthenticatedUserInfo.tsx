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

    return (<>
            <div>
                Welcome {user}!
            </div>
            <Button onClick={handleLogout}
                variant="contained"
                color="error"
                data-testid="logout-button"
            >
                Logout
            </Button>
            </>
    );

}