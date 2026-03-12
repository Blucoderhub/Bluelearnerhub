"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { School } from "lucide-react";

export default function UniversityLogin() {
    const handleSubmit = async (data: any) => {
        console.log("University Login:", data);
    };

    return (
        <LoginLayout
            title="University Hub"
            subtitle="Academic Path Coordination"
            icon={<School size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
