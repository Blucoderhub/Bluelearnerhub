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
            role="candidate"
            title="Candidate Dash"
            subtitle="View job applications, prepare for interviews, and showcase your portfolio."
            accentColor="#0ea5e9" // Emerald
            icon={<UserCircle size={48} />}
        >
            <LoginForm role="candidate" accentColor="#0ea5e9" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
