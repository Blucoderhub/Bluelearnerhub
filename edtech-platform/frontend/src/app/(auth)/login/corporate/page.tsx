"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Briefcase } from "lucide-react";

export default function CorporateLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Corporate Login:", data);
    };

    return (
        <LoginLayout
            role="corporate"
            title="Corporate Dashboard"
            subtitle="Manage your organization's talent, host hackathons, and view analytics."
            accentColor="#6366f1" // Indigo
            icon={<Briefcase size={48} />}
        >
            <LoginForm role="corporate" accentColor="#6366f1" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
