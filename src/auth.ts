import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { credentialsSchema } from "@/lib/auth-schemas";

/**
 * Kimlik dogrulama.
 *
 * E-posta + sifre ile giris. Misafir alisverisi bozulmuyor: uyelik istege
 * bagli, oturum yoksa siparis yine olusturulabiliyor (userId null).
 *
 * Oturum JWT ile tasiniyor cunku Credentials saglayicisi veritabani
 * oturumlariyla calismiyor; kullanici kaydi yine Prisma'da.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        // Sifresiz kayit (harici saglayici ile acilmis) parola ile giremez.
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session: ({ session, token }) => {
      // Sunucu kodu oturumdaki kullanici kimligini bu alandan okuyor.
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
