import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "SYMBI-Test/1.0",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Respond with exactly: 'SYMBI API test successful! Ready for collaboration.'",
          },
          {
            role: "user",
            content: "Test",
          },
        ],
        max_tokens: 50,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: "Generation failed",
          message: `❌ Cannot generate text (${response.status})`,
          details: {
            status: response.status,
            error: errorData.error?.message || "Unknown error",
          },
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const generatedText = data.choices[0]?.message?.content || "No response"
    const isSuccessful = generatedText.toLowerCase().includes("successful")

    return NextResponse.json({
      message: isSuccessful ? "✅ Text generation working perfectly!" : "⚠️ Generation working but unexpected response",
      details: {
        generatedText,
        tokensUsed: data.usage?.total_tokens || 0,
        model: data.model,
        testPassed: isSuccessful,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Generation test failed",
        message: `❌ Error testing generation: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
