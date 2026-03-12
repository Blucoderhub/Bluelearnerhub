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
            title="HR Talent Portal"
            subtitle="Recruitment & Pipeline Management"
            icon={<Users size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
