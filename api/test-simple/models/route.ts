import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "SYMBI-Test/1.0",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: "Model access failed",
          message: `❌ Cannot access OpenAI models (${response.status})`,
          details: {
            status: response.status,
            statusText: response.statusText,
            error: errorData.error?.message || "Unknown API error",
          },
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const models = data.data || []

    // Check for important models
    const gpt4Models = models.filter((m: any) => m.id.includes("gpt-4"))
    const gpt35Models = models.filter((m: any) => m.id.includes("gpt-3.5"))
    const hasGPT4 = gpt4Models.length > 0
    const hasGPT35 = gpt35Models.length > 0

    let message = "✅ Model access working"
    if (hasGPT4) {
      message += " - GPT-4 available! 🚀"
    } else if (hasGPT35) {
      message += " - GPT-3.5 available"
    } else {
      message = "⚠️ Limited model access"
    }

    return NextResponse.json({
      message,
      details: {
        totalModels: models.length,
        gpt4Available: hasGPT4,
        gpt35Available: hasGPT35,
        bestModel: hasGPT4 ? "gpt-4" : hasGPT35 ? "gpt-3.5-turbo" : "limited",
        availableModels: models.slice(0, 10).map((m: any) => m.id),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Model check failed",
        message: `❌ Error checking models: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
