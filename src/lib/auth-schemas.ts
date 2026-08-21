import { z } from "zod";

/**
 * Kimlik dogrulama semalari.
 * auth.ts sunucuda, formlar istemcide ayni semayi kullanir.
 */
export const credentialsSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(1, "Şifrenizi girin."),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Adınızı yazın."),
    lastName: z.string().trim().min(2, "Soyadınızı yazın."),
    email: z.string().trim().email("Geçerli bir e-posta adresi girin."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      // Cok basit sifreleri engelle; uzunluk tek basina yeterli degil.
      .regex(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/, "Şifre en az bir harf içermeli.")
      .regex(/\d/, "Şifre en az bir rakam içermeli."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
