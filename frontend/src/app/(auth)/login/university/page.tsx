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
            role="university"
            title="University Hub"
            subtitle="Coordinate student learning paths, monitor academic progress, and manage campus events."
            accentColor="#8b5cf6" // Violet
            icon={<School size={48} />}
        >
            <LoginForm role="university" accentColor="#8b5cf6" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
