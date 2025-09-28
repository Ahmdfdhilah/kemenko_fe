// src/pages/Unauthorized/UnauthorizedPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UnauthorizedPage: React.FC = () => {
    const { user } = useAuth();


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Akses Ditolak
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Kamu tidak memiliki akses ke halaman  ini
                    </p>
                    {user && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            Role: <span className="font-medium">{user.role}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Kembali ke halaman utama
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;