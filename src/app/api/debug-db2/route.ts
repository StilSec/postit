import mariadb from "mariadb";
import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = new URL(process.env.DATABASE_URL!);

  try {
    const conn = await mariadb.createConnection({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace(/^\//, ""),
      ssl: { rejectUnauthorized: false },
      connectTimeout: 8000,
    });

    const rows = await conn.query("SELECT 1 as result");
    await conn.end();

    return NextResponse.json({ status: "SUCCESS", rows });
  } catch (err: any) {
    return NextResponse.json({ status: "ERROR", message: err.message, code: err.code });
  }
}