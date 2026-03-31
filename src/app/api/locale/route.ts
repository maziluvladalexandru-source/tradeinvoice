import { NextRequest, NextResponse } from "next/server";

const VALID_LOCALES = ["en", "nl", "de"];

export async function POST(req: NextRequest) {
  try {
    const { locale } = await req.json();
    if (!locale || !VALID_LOCALES.includes(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true, locale });
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // needs to be readable by client
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to set locale" }, { status: 500 });
  }
}
