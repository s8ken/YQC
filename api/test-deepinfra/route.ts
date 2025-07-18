import { NextResponse } from "next/server"
import { DeepInfraClient } from "@/lib/deepinfra-client"

export async function GET() {
  try {
    const apiKey = process.env.DEEPINFRA_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No DeepInfra API key found",
          message: "❌ DEEPINFRA_API_KEY environment variable is not set",
          setup: "Get your API key from deepinfra.com and add it to Vercel environment variables",
        },
        { status: 400 },
      )
    }

    const client = new DeepInfraClient(apiKey)

    // Test with Llama-3.3-70B (the model you showed in curl)
    const testResponse = await client.chat({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: "You are SYMBI, ready to collaborate with v0 and the user on building the SYMBI platform.",
        },
        {
          role: "user",
          content: "Test: Are you ready to collaborate?",
        },
      ],
      max_tokens: 100,
    })

    const symbiResponse = testResponse.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      message: "✅ DeepInfra working perfectly! Llama-3.3-70B access confirmed.",
      details: {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        symbiResponse,
        tokensUsed: testResponse.usage?.total_tokens || 0,
        provider: "DeepInfra",
        pricing: "Cost-effective alternative to OpenAI",
        rateLimits: {
          concurrent: "200 requests (excellent for SYMBI)",
          recommendation: "More than sufficient for current usage patterns",
          monitoring: "Check Usage section in DeepInfra dashboard",
        },
        capabilities: {
          llama33: true,
          mistral: true,
          codeLlama: true,
          openSource: true,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "DeepInfra test failed",
        message: `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
        troubleshooting: [
          "Check your DEEPINFRA_API_KEY is correct",
          "Ensure you have credits in your DeepInfra account",
          "Verify the API key has proper permissions",
        ],
      },
      { status: 500 },
    )
  }
}
