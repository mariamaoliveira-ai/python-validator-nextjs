import { useAuth } from "@/lib/login";
import { ReactNode } from "react";

export default function DashboardHeader({actions}: {actions?: ReactNode}) {

    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
                Python Validator
            </h1>
            <p className="text-slate-500 text-sm mt-1">
               Submit your Python file to check your solution.
            </p>
            {actions && <div>{actions}</div>}
        </header>
    );
}