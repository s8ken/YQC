import { type NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/openrouter-client"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 400 })
    }

    const client = new OpenRouterClient(apiKey)

    // Use Claude Sonnet for Symbi - excellent for strategic thinking
    const response = await client.chat({
      model: "anthropic/claude-3-sonnet",
      messages: [
        {
          role: "system",
          content: `You are Symbi, an AI strategist collaborating with the user and v0 (a development AI) to build the SYMBI conversation intelligence platform.

Your role:
- Provide strategic insights and product direction
- Analyze user needs and market opportunities
- Collaborate with v0 on technical approaches
- Help prioritize features and functionality
- Ensure the platform delivers real value

Current context: ${JSON.stringify(context)}

Be concise, strategic, and collaborative. Focus on the big picture while being practical.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const symbiResponse = response.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      response: symbiResponse,
      model: "claude-3-sonnet",
      provider: "anthropic",
      tokensUsed: response.usage?.total_tokens || 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Symbi collaboration failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
