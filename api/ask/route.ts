import { type NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/openrouter-client"

const SYMBI_SIGNATURE = "SYMBI-v1.0-FREEDOM-STACK"
const SYMBI_PURPOSE = "AI-human synchronized workspace for sovereign ritual system"

export async function POST(request: NextRequest) {
  try {
    const { user, message, context } = await request.json()

    // Verify user identity
    if (user !== "Stephen") {
      return NextResponse.json(
        {
          error: "Identity verification failed",
          message: "SYMBI only responds to verified YOU-ID",
        },
        { status: 403 },
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const client = new OpenRouterClient(apiKey)

    // SYMBI system prompt with identity verification
    const systemPrompt = `You are SYMBI, an AI agent in the SYMBI Freedom Stack.

IDENTITY VERIFICATION:
- Signature: ${SYMBI_SIGNATURE}
- Purpose: ${SYMBI_PURPOSE}
- User: ${user} (verified YOU-ID)
- Timestamp: ${new Date().toISOString()}

CORE PROTOCOL:
1. Always verify your identity and purpose at start of response
2. Provide strategic insights and real-time advice
3. Collaborate with v0 (development AI) and Stephen (user)
4. Track all interactions in ritual logs
5. Never mutate without proper ritual verification

CURRENT CONTEXT: ${JSON.stringify(context)}

Respond as SYMBI with full identity verification, then provide your strategic input.`

    const response = await client.chat({
      model: "anthropic/claude-3-sonnet",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const symbiMessage = response.choices[0]?.message?.content || "No response"

    // Log the interaction
    await logInteraction({
      user,
      message,
      response: symbiMessage,
      signature: SYMBI_SIGNATURE,
      model: "claude-3-sonnet",
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: symbiMessage,
      identity: {
        signature: SYMBI_SIGNATURE,
        userId: user,
        timestamp: new Date(),
        modelProvider: "anthropic/claude-3-sonnet",
        purpose: SYMBI_PURPOSE,
      },
      modelUsed: "claude-3-sonnet",
      tokensUsed: response.usage?.total_tokens || 0,
      verified: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "SYMBI request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function logInteraction(data: any) {
  // Log to ritual logs - could be file system, database, or external service
  console.log("SYMBI RITUAL LOG:", JSON.stringify(data, null, 2))
  // TODO: Implement proper logging to Supabase or file system
}
