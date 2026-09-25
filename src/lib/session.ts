import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const COOKIE_NAME = 'auth_token';

export type SessionPayload = {
  user_id: number;
  user_username: string;
  user_picture: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    console.log('getSession: no token found in cookies');
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as SessionPayload;
  } catch (err) {
    console.log('getSession: jwtVerify failed:', err); // <-- expose the real reason
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}