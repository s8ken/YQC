import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 400 })
    }

    // Test simple text generation
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a test assistant. Respond with exactly: 'OpenAI API test successful!'",
          },
          {
            role: "user",
            content: "Test message",
          },
        ],
        max_tokens: 50,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "Generation test failed",
          message: errorData.error?.message || "Unknown error",
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const generatedText = data.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      message: "✅ Text generation working correctly",
      details: {
        generatedText,
        tokensUsed: data.usage?.total_tokens || 0,
        model: data.model,
        successful: generatedText.includes("successful"),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Generation test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
