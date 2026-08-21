import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 yapilandirmasi.
 * Baglanti adresi artik schema.prisma icindeki datasource blogunda degil,
 * burada tanimlanir; CLI (migrate, seed) bunu kullanir.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
