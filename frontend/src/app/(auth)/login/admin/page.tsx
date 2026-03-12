"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Admin Login:", data);
    };

    return (
        <LoginLayout
            title="Admin Center"
            subtitle="System Access & Platform Control"
            icon={<ShieldCheck size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
