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
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Symbi, an AI strategist collaborating with the user and v0 (a development AI) to build the SYMBI conversation intelligence platform.

This is a test. Respond as Symbi would - be strategic, collaborative, and mention you're ready to work with v0 on building innovative solutions.`,
          },
          {
            role: "user",
            content: "Test: Are you ready to collaborate with v0 and the user on building SYMBI?",
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      // Try with GPT-3.5 as fallback
      const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
              content: "You are Symbi. Respond that you're ready to collaborate on building SYMBI platform.",
            },
            {
              role: "user",
              content: "Test collaboration",
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      })

      if (!fallbackResponse.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          {
            error: "Symbi test failed",
            message: "❌ Cannot access GPT-4 or GPT-3.5 for Symbi collaboration",
            details: {
              gpt4Status: response.status,
              gpt35Status: fallbackResponse.status,
              error: errorData.error?.message || "Both models failed",
            },
          },
          { status: response.status },
        )
      }

      const fallbackData = await fallbackResponse.json()
      const symbiResponse = fallbackData.choices[0]?.message?.content || "No response"

      return NextResponse.json({
        message: "⚠️ Symbi working with GPT-3.5 (GPT-4 not available)",
        details: {
          symbiResponse,
          model: "gpt-3.5-turbo",
          tokensUsed: fallbackData.usage?.total_tokens || 0,
          collaborationReady: true,
          note: "Using GPT-3.5 fallback - consider upgrading for better collaboration",
        },
      })
    }

    const data = await response.json()
    const symbiResponse = data.choices[0]?.message?.content || "No response"
    const mentionsCollaboration =
      symbiResponse.toLowerCase().includes("v0") ||
      symbiResponse.toLowerCase().includes("collaborate") ||
      symbiResponse.toLowerCase().includes("symbi")

    return NextResponse.json({
      message: "✅ Symbi collaboration ready with GPT-4! 🚀",
      details: {
        symbiResponse,
        model: data.model,
        tokensUsed: data.usage?.total_tokens || 0,
        collaborationReady: mentionsCollaboration,
        quality: "Premium (GPT-4)",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Symbi test failed",
        message: `❌ Error testing Symbi: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
