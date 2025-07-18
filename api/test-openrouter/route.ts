import { NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/openrouter-client"

export async function GET() {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No OpenRouter API key found",
          message: "❌ OPENROUTER_API_KEY environment variable is not set",
          setup: "Get your API key from openrouter.ai and add it to Vercel environment variables",
        },
        { status: 400 },
      )
    }

    const client = new OpenRouterClient(apiKey)

    // Test basic connectivity
    const models = await client.getModels()
    const availableModels = models.data || []

    // Test chat with a fast, cheap model
    const testResponse = await client.chat({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Symbi, ready to collaborate with v0 and the user on building the SYMBI platform.",
        },
        {
          role: "user",
          content: "Test: Are you ready to collaborate?",
        },
      ],
      max_tokens: 100,
    })

    const symbiResponse = testResponse.choices[0]?.message?.content || "No response"

    // Check for premium models
    const hasGPT4 = availableModels.some((m: any) => m.id.includes("gpt-4"))
    const hasClaude = availableModels.some((m: any) => m.id.includes("claude"))
    const hasGemini = availableModels.some((m: any) => m.id.includes("gemini"))

    return NextResponse.json({
      message: "✅ OpenRouter working perfectly! Multi-model access confirmed.",
      details: {
        totalModels: availableModels.length,
        symbiResponse,
        tokensUsed: testResponse.usage?.total_tokens || 0,
        availableProviders: {
          openai: hasGPT4,
          anthropic: hasClaude,
          google: hasGemini,
        },
        recommendedModels: {
          symbi: "anthropic/claude-3-sonnet",
          technical: "openai/gpt-4",
          analysis: "google/gemini-pro",
        },
        pricing: "Pay-per-use, often cheaper than direct APIs",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "OpenRouter test failed",
        message: `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
        troubleshooting: [
          "Check your OPENROUTER_API_KEY is correct",
          "Ensure you have credits in your OpenRouter account",
          "Verify the API key has proper permissions",
        ],
      },
      { status: 500 },
    )
  }
}
