'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthFormData = {
    email: string;
    password: string;
    name: string;
    role: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setName: (name: string) => void;
    setRole: (role: string) => void;
};

const AuthFormContext = createContext<AuthFormData | undefined>(undefined);

export const useAuthForm = () => {
    const context = useContext(AuthFormContext);
    if (!context) throw new Error('useAuthForm must be used within AuthFormProvider');
    return context;
};

export const AuthFormProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    return (
        <AuthFormContext.Provider value={{ email, setEmail, password, setPassword, name, setName, role, setRole }}>
            {children}
        </AuthFormContext.Provider>
);
};