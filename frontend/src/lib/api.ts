const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface HelloResponse {
    message: string;
    description: string;
}

export const api = {
    async getHello(): Promise<HelloResponse> {
        const response = await fetch(`${API_BASE_URL}/api/hello`);
        if (!response.ok) {
            throw new Error('Failed to fetch hello');
        }
        return response.json();
    },

    async getHelloName(name: string): Promise<HelloResponse> {
        const response = await fetch(`${API_BASE_URL}/api/hello/${name}`);
        if (!response.ok) {
            throw new Error('Failed to fetch hello with name');
        }
        return response.json();
    }
};