import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Hesap Oluştur",
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <Container as="section" className="py-stack-lg">
      <Suspense fallback={null}>
        <AuthForm mode="kayit" />
      </Suspense>
    </Container>
  );
}
