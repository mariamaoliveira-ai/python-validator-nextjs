'use client'

import { useAuth } from "@/lib/login";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import {useRouter} from 'next/navigation'


export default function LoginPage(){
    const router = useRouter();
    const {user, login, logout} = useAuth();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginSuccess = login(userName, password);
        if(!loginSuccess){
            setErrorMessage('Invalid username or password');
        }else{
            router.push('/dashboard');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <Box component="form" onSubmit={handleLogin}>
                {errorMessage && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <TextField 
                    label="Password" 
                    variant="outlined" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    type="submit" 
                    variant="contained"
                >
                    Login
                </Button>
            </Box>
        </div>
    );
}