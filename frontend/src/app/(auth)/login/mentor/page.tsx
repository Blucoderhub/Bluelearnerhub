"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Users } from "lucide-react";

export default function MentorLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Mentor Login:", data);
    };

    return (
        <LoginLayout
            role="mentor"
            title="Mentor Portal"
            subtitle="Access your mentoring dashboard, manage students, and track academic progress."
            accentColor="#10b981" // Emerald
            icon={<Users size={48} />}
        >
            <LoginForm role="candidate" accentColor="#10b981" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
