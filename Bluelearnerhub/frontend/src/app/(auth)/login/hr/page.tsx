"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Users } from "lucide-react";

export default function HRLogin() {
    const handleSubmit = async (data: any) => {
        console.log("HR Login:", data);
    };

    return (
        <LoginLayout
            role="hr"
            title="HR Talent Portal"
            subtitle="Source top candidates, review interview results, and manage hiring pipelines."
            accentColor="#f59e0b" // Amber
            icon={<Users size={48} />}
        >
            <LoginForm role="hr" accentColor="#f59e0b" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
