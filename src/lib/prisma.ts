import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma";

console.log(process.env.DATABASE_URL ? 'DB URL present' : 'DB URL MISSING')

const dbUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace(/^\//, ""),
  connectionLimit: 5,
  connectTimeout: 10000,   // was defaulting to 1000ms — too short for Aiven's TLS handshake
  acquireTimeout: 15000,   // give it a bit more headroom overall too
  ssl: {
    rejectUnauthorized: false,
  },
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
