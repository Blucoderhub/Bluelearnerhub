'use client';

import React from 'react';
import { StudentLoginLayout } from '@/components/auth/StudentLoginLayout';
import { StudentLoginForm } from '@/components/auth/StudentLoginForm';

export default function StudentLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Student Login:", data);
    };

    return (
        <StudentLoginLayout>
            <StudentLoginForm onSubmit={handleSubmit} />
        </StudentLoginLayout>
    );
}
