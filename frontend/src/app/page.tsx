'use client';

import { useState, useEffect } from 'react';
import { helloapi, HelloResponse } from '@/lib/helloapi';

export default function Home() {
    const [helloData, setHelloData] = useState<HelloResponse | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHello();
    }, []);

    const loadHello = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await helloapi.getHello();
            setHelloData(data);
        } catch (err) {
            setError('Could not connect to backend! Is spring boot running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            setError('');
            const data = await helloapi.getHelloName(name);
            setHelloData(data);
        } catch (err) {
            setError('Could not fetch data from backend');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-4">
                        Doggy Day Care App
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Test of Next.js + Spring Boot + Docker
                    </p>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {helloData && !loading && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-green-800 mb-2">
                                {helloData.message}
                            </h2>
                            <p className="text-green-600">
                                {helloData.description}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Skriv ditt namn:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="t.ex. Anna"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Fetch personalized message
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Status:</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${helloData ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Backend (Spring Boot): {helloData ? 'Connected' : 'Waiting..'}
                            </li>
                            <li className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                                Frontend (Next.js): Running
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
