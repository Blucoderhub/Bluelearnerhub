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
            title="Mentor Portal"
            subtitle="Elite Guided Learning & Management"
            icon={<Users size={32} />}
        >
            <LoginForm onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
