"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { registerSchema, credentialsSchema } from "@/lib/auth-schemas";

export type AuthResult = { ok: true } | { ok: false; error: string };

/** Sifreler bcrypt ile saklanir; duz metin hicbir yerde tutulmaz. */
const SALT_ROUNDS = 12;

export async function registerAction(input: unknown): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Bilgiler geçersiz.",
    };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return {
      ok: false,
      error: "Bu e-posta adresiyle bir hesap zaten var. Giriş yapmayı deneyin.",
    };
  }

  await prisma.user.create({
    data: {
      email: normalizedEmail,
      firstName,
      lastName,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    },
  });

  // Kayittan sonra dogrudan oturum ac; kullaniciyi tekrar form doldurtma.
  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch {
    // Kayit basarili ama otomatik giris olmadi; kullanici giris sayfasina gider.
    return { ok: true };
  }

  return { ok: true };
}

export async function loginAction(input: unknown): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Bilgiler geçersiz.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      // Hangi alanin yanlis oldugunu soylemiyoruz: e-posta taramasini zorlastirir.
      return { ok: false, error: "E-posta ya da şifre hatalı." };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
