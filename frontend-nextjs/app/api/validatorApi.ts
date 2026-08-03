import { API_BASE_URL } from './constants';

export type ValidationRequest = {
    studentName: string;
    file: File;
};

export type ValidationResponse = {
    message: string;
    execution_status: string;
};

export type Submission = {
    student_name: string;
    file_name: string;
    status: string;
    result_execution: string;
    created_at: string | number | Date;
};


export async function submitValidation(
    payload: ValidationRequest): Promise<ValidationResponse> {
    const formData = new FormData();
    formData.append('student_name', payload.studentName);
    formData.append('file', payload.file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<ValidationResponse>;

}


export async function getSubmissions(): Promise<Submission[]> {
    const response = await fetch(`${API_BASE_URL}/submissions`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }   
    return response.json() as Promise<Submission[]>;
}
