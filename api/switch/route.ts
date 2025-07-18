import { type NextRequest, NextResponse } from "next/server"

const AVAILABLE_MODELS = {
  "claude-sonnet": "anthropic/claude-3-sonnet",
  "gpt-4": "openai/gpt-4",
  mixtral: "mistralai/mixtral-8x7b-instruct",
  llama: "meta-llama/llama-2-70b-chat",
}

export async function POST(request: NextRequest) {
  try {
    const { model, user } = await request.json()

    if (user !== "Stephen") {
      return NextResponse.json({ error: "Unauthorized model switch" }, { status: 403 })
    }

    if (!AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS]) {
      return NextResponse.json(
        {
          error: "Invalid model",
          availableModels: Object.keys(AVAILABLE_MODELS),
        },
        { status: 400 },
      )
    }

    const selectedModel = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS]

    return NextResponse.json({
      success: true,
      currentModel: selectedModel,
      modelName: model,
      message: `SYMBI switched to ${model} (${selectedModel})`,
      timestamp: new Date(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Model switch failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
