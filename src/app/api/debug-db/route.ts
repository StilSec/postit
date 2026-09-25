import net from "net";
import { NextResponse } from "next/server";

export async function GET() {
  return new Promise<Response>((resolve) => {
    const socket = new net.Socket();
    const host = process.env.DATABASE_HOST || "public-mysql-3c1c81eb-postit.b.aivencloud.com";
    const port = Number(process.env.DATABASE_PORT) || 27308;

    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(NextResponse.json({ status: "TIMEOUT", host, port }));
    }, 8000);

    socket.connect(port, host, () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(NextResponse.json({ status: "CONNECTED", host, port }));
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      resolve(NextResponse.json({ status: "ERROR", message: err.message, host, port }));
    });
  });
}