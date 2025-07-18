import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API key not found",
          message: "OPENAI_API_KEY environment variable is not set",
        },
        { status: 400 },
      )
    }

    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json(
        {
          error: "Invalid API key format",
          message: "OpenAI API key should start with 'sk-'",
        },
        { status: 400 },
      )
    }

    // Test basic API access
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "API key validation failed",
          message: `OpenAI API returned ${response.status}: ${errorData.error?.message || "Unknown error"}`,
          details: errorData,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      message: "✅ OpenAI API key is valid and working",
      details: {
        keyFormat: "Valid (starts with sk-)",
        apiAccess: "Successful",
        status: response.status,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Validation test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
