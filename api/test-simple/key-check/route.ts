import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No API key found",
          message: "❌ OPENAI_API_KEY environment variable is not set in your Vercel project",
          details: {
            suggestion: "Add OPENAI_API_KEY to your Vercel environment variables",
            keyFormat: "Should start with 'sk-' or 'sk-proj-'",
          },
        },
        { status: 400 },
      )
    }

    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json(
        {
          error: "Invalid key format",
          message: "❌ API key doesn't start with 'sk-'",
          details: {
            keyStart: apiKey.substring(0, 8) + "...",
            expectedFormat: "sk-... or sk-proj-...",
          },
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      message: "✅ API key found and format looks correct",
      details: {
        keyFormat: "Valid",
        keyStart: apiKey.substring(0, 12) + "...",
        keyLength: apiKey.length,
        type: apiKey.startsWith("sk-proj-") ? "Project Key" : "Legacy Key",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Key check failed",
        message: `❌ Error checking API key: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
