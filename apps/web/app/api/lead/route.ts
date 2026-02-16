import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, source, instagram, followers, goal, why } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400 }
      );
    }

    // TODO: Save to Supabase database when configured
    // TODO: Send email via Resend when configured
    console.log("New lead:", { email, name, source, instagram, followers, goal, why });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Wewnetrzny blad serwera" },
      { status: 500 }
    );
  }
}
