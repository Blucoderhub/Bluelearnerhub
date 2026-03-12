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
            title="Corporate Portal"
            subtitle="Talent Management & Analytics"
            icon={<Briefcase size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
