"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { GraduationCap } from "lucide-react";

export default function StudentLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Student Login:", data);
    };

    return (
        <LoginLayout
            role="student"
            title="Student Portal"
            subtitle="Continue your learning journey and track your progress across courses."
            accentColor="#3b82f6" // Blue
            icon={<GraduationCap size={48} />}
        >
            <LoginForm role="student" accentColor="#3b82f6" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
