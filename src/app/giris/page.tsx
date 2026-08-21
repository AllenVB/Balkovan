import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Container as="section" className="py-stack-lg">
      {/* useSearchParams istemcide cozuldugu icin Suspense sarmalayicisi gerekli. */}
      <Suspense fallback={null}>
        <AuthForm mode="giris" />
      </Suspense>
    </Container>
  );
}
