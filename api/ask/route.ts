import { type NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/openrouter-client"
import { logger } from "@/lib/logger"

const SYMBI_SIGNATURE = "SYMBI-v1.0-FREEDOM-STACK"
const SYMBI_PURPOSE = "AI-human synchronized workspace for sovereign ritual system"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { user, message, context } = await request.json()

    await logger.info(
      "SYMBI consultation request received",
      {
        user,
        messageLength: message?.length,
        context,
      },
      user,
      "/api/ask",
    )

    // Verify user identity
    if (user !== "Stephen") {
      await logger.warn(
        "Identity verification failed",
        {
          attemptedUser: user,
          expectedUser: "Stephen",
        },
        user,
        "/api/ask",
      )

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
      await logger.error("OpenRouter API key not configured", {}, user, "/api/ask")
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

    await logger.debug(
      "Sending request to OpenRouter",
      {
        model: "anthropic/claude-3-sonnet",
        systemPromptLength: systemPrompt.length,
        messageLength: message.length,
      },
      user,
      "/api/ask",
    )

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
    const tokensUsed = response.usage?.total_tokens || 0
    const responseTime = Date.now() - startTime

    // Log the successful interaction
    await logger.info(
      "SYMBI consultation completed successfully",
      {
        user,
        tokensUsed,
        responseTime,
        responseLength: symbiMessage.length,
        signature: SYMBI_SIGNATURE,
      },
      user,
      "/api/ask",
    )

    // Log the interaction details for ritual tracking
    await logInteraction({
      user,
      message,
      response: symbiMessage,
      signature: SYMBI_SIGNATURE,
      model: "claude-3-sonnet",
      timestamp: new Date(),
      tokensUsed,
      responseTime,
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
      tokensUsed,
      responseTime,
      verified: true,
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await logger.error(
      "SYMBI consultation failed",
      {
        error: errorMessage,
        responseTime,
        stack: error instanceof Error ? error.stack : undefined,
      },
      undefined,
      "/api/ask",
    )

    return NextResponse.json(
      {
        error: "SYMBI request failed",
        message: errorMessage,
      },
      { status: 500 },
    )
  }
}

async function logInteraction(data: any) {
  await logger.info(
    "SYMBI ritual interaction logged",
    {
      interactionType: "consultation",
      ...data,
    },
    data.user,
    "/api/ask",
  )
}
