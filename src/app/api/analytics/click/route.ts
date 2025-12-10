import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/analytics/click - Track a button click on completion page
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { quizId, buttonUrl } = body;

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID required" }, { status: 400 });
    }

    // Record the click
    await supabase.from("link_clicks").insert({
      quiz_id: quizId,
      button_url: buttonUrl || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}
