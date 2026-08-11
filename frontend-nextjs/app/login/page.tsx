'use client'

import { useAuth } from "@/lib/login";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import PageHeader from "@/components/page-header/PageHeader";


export default function LoginPage() {
    const router = useRouter();
    const { user, login, logout } = useAuth();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginSuccess = login(userName, password);
        if (!loginSuccess) {
            setErrorMessage('Invalid username or password');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <PageHeader></PageHeader>
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <h4>Welcome back! Enter your details to access the dashboard!</h4>
                </div>
                <Box component="form" onSubmit={handleLogin}>
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}
                    <div className="mb-5">
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            data-testid='username-input'
                            size="small"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-testid='password-input'
                            size="small"
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            variant="contained"
                            data-testid="login-button"
                            className="w-full"

                        >
                            Login
                        </Button>
                    </div>
                </Box>
            </section>
        </div>
    );
}