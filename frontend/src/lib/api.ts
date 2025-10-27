// This file handles all API calls to the backend
// It centralizes the base URL and error handling for cleaner code

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1'; // keeps your API versioning consistent in one place

// Generic GET helper function
async function get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`);

    // Throw an error if the response isn't successful
    if (!response.ok) {
        throw new Error(`Request failed: ${path} (status ${response.status})`);
    }

    // Parse and return the JSON result
    return response.json();
}

// Define the response type that matches the backend's HelloResponse record
export interface HelloResponse {
    message: string;
    description: string;
}

// Group all API methods under one export
export const api = {
    // GET /api/v1/hello
    getHello: () => get<HelloResponse>('/hello'),

    // GET /api/v1/hello/{name}
    getHelloName: (name: string) => get<HelloResponse>(`/hello/${name}`),
};
