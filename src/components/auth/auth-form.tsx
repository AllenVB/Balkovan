"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icon";
import { loginAction, registerAction } from "@/server/auth-actions";
import {
  credentialsSchema,
  registerSchema,
  type RegisterValues,
} from "@/lib/auth-schemas";
import type { z } from "zod";

const inputClassName =
  "w-full bg-surface-bright border-2 border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-0 focus:outline-none transition-colors";

type LoginValues = z.infer<typeof credentialsSchema>;

/**
 * Giris ve kayit formu.
 *
 * Tasarim dosyalarinda bu ekranlar yok; site dili (renk, tipografi, form
 * bicimi) korunarak olusturuldu. Tasarim gelirse yalnizca bu bilesen degisir.
 */
export function AuthForm({ mode }: { mode: "giris" | "kayit" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Korumali bir sayfadan yonlendirildiyse girisden sonra oraya donulur.
  const redirectTo = searchParams.get("devam") ?? "/hesabim";
  const [serverError, setServerError] = useState<string | null>(null);

  const isLogin = mode === "giris";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const form = isLogin ? loginForm : registerForm;
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginValues | RegisterValues) => {
    setServerError(null);
    const result = isLogin
      ? await loginAction(values)
      : await registerAction(values);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    router.push(redirectTo);
    // Sunucu bileşenleri yeni oturumu görsün.
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 md:p-8">
        <h1 className="font-headline-md text-headline-md text-primary mb-2">
          {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {isLogin
            ? "Siparişlerinizi takip edin, bal puanlarınızı kullanın."
            : "Her siparişte bal puanı kazanın, adreslerinizi kaydedin."}
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit as never)}
          className="flex flex-col gap-5"
          noValidate
        >
          {!isLogin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Adınız"
                htmlFor="firstName"
                error={registerForm.formState.errors.firstName?.message}
              >
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={inputClassName}
                  {...registerForm.register("firstName")}
                />
              </Field>
              <Field
                label="Soyadınız"
                htmlFor="lastName"
                error={registerForm.formState.errors.lastName?.message}
              >
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={inputClassName}
                  {...registerForm.register("lastName")}
                />
              </Field>
            </div>
          ) : null}

          <Field
            label="E-posta"
            htmlFor="email"
            error={
              isLogin
                ? loginForm.formState.errors.email?.message
                : registerForm.formState.errors.email?.message
            }
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@eposta.com"
              className={inputClassName}
              {...(isLogin
                ? loginForm.register("email")
                : registerForm.register("email"))}
            />
          </Field>

          <Field
            label="Şifre"
            htmlFor="password"
            error={
              isLogin
                ? loginForm.formState.errors.password?.message
                : registerForm.formState.errors.password?.message
            }
            hint={isLogin ? undefined : "En az 8 karakter, harf ve rakam içermeli."}
          >
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={inputClassName}
              {...(isLogin
                ? loginForm.register("password")
                : registerForm.register("password"))}
            />
          </Field>

          {!isLogin ? (
            <Field
              label="Şifre (tekrar)"
              htmlFor="passwordConfirm"
              error={registerForm.formState.errors.passwordConfirm?.message}
            >
              <input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                className={inputClassName}
                {...registerForm.register("passwordConfirm")}
              />
            </Field>
          ) : null}

          {serverError ? (
            <p
              role="alert"
              className="flex items-start gap-2 bg-error-container text-on-error-container rounded-lg p-3 font-body-md text-sm"
            >
              <Icon name="info" className="shrink-0 text-sm" />
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-deep text-on-primary rounded-xl font-label-md text-label-md font-bold py-4 hover:bg-primary transition-colors warm-shadow disabled:opacity-60"
          >
            {isSubmitting
              ? "Lütfen bekleyin..."
              : isLogin
                ? "Giriş Yap"
                : "Hesap Oluştur"}
          </button>
        </form>
      </div>

      <p className="text-center font-body-md text-body-md text-on-surface-variant mt-6">
        {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
        <Link
          href={isLogin ? "/kayit" : "/giris"}
          className="text-primary font-bold hover:underline"
        >
          {isLogin ? "Hesap oluşturun" : "Giriş yapın"}
        </Link>
      </p>

      <p className="text-center font-body-md text-sm text-ink-muted mt-2">
        Üye olmadan da alışveriş yapabilirsiniz.
      </p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-label-md text-label-md text-on-surface-variant mb-2"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-2 font-body-md text-xs text-ink-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-2 font-label-md text-label-md text-error">{error}</p>
      ) : null}
    </div>
  );
}
