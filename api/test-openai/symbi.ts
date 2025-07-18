import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 400 })
    }

    // Test Symbi collaboration functionality
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Symbi, collaborating with the user and v0 to build the SYMBI conversation intelligence platform. 
            
            This is a test message. Respond as Symbi would in a collaboration session. Be strategic, helpful, and mention that you're ready to work with v0 on building the platform.`,
          },
          {
            role: "user",
            content: "Test: Are you ready to collaborate with v0 on building SYMBI?",
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "Symbi test failed",
          message: errorData.error?.message || "Unknown error",
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const symbiResponse = data.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      message: "✅ Symbi collaboration ready",
      details: {
        symbiResponse,
        tokensUsed: data.usage?.total_tokens || 0,
        model: data.model,
        collaborationReady:
          symbiResponse.toLowerCase().includes("v0") || symbiResponse.toLowerCase().includes("collaborate"),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Symbi test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
