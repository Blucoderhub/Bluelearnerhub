"use client";

import React from "react";
import { LoginLayout } from "@/components/auth/LoginLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
    const handleSubmit = async (data: any) => {
        console.log("Admin Login:", data);
        // Add logic to call your API or NextAuth
    };

    return (
        <LoginLayout
            role="admin"
            title="Admin Control Center"
            subtitle="Full system access and management tools for platform administrators."
            accentColor="#ef4444" // Red
            icon={<ShieldCheck size={48} />}
        >
            <LoginForm role="admin" accentColor="#ef4444" onSubmit={handleSubmit} />
        </LoginLayout>
    );
}
