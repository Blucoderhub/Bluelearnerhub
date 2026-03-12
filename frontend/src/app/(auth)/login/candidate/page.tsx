"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { UserCircle } from "lucide-react";

export default function CandidateLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Candidate Login:", data);
    };

    return (
        <LoginLayout
            title="Candidate Portal"
            subtitle="Elite Career & Skill Assessment"
            icon={<UserCircle size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
