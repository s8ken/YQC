import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "Failed to fetch models",
          message: errorData.error?.message || "Unknown error",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const models = data.data || []

    // Check for key models we need
    const gpt4Models = models.filter((m: any) => m.id.includes("gpt-4"))
    const gpt35Models = models.filter((m: any) => m.id.includes("gpt-3.5"))

    const hasGPT4 = gpt4Models.length > 0
    const hasGPT35 = gpt35Models.length > 0

    return NextResponse.json({
      message: `✅ Found ${models.length} available models`,
      details: {
        totalModels: models.length,
        gpt4Available: hasGPT4,
        gpt35Available: hasGPT35,
        gpt4Models: gpt4Models.map((m: any) => m.id),
        gpt35Models: gpt35Models.map((m: any) => m.id),
        recommendedModel: hasGPT4 ? "gpt-4" : hasGPT35 ? "gpt-3.5-turbo" : "none",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Model check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
