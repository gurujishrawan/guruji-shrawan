import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Captcha secret not configured." },
      { status: 500 }
    );
  }

  const { email, token } = await request.json();
  if (!email || !token) {
    return NextResponse.json(
      { error: "Email and captcha token are required." },
      { status: 400 }
    );
  }

  const verifyResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    }
  );

  const verification = await verifyResponse.json();
  if (!verification.success) {
    return NextResponse.json(
      { error: "Captcha verification failed." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
