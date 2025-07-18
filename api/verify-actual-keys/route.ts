import { NextResponse } from "next/server"

export async function GET() {
  const actualKeys = {
    openai: !!process.env.OPENAI_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
    deepinfra: !!process.env.DEEPINFRA_API_KEY,
  }

  const keyDetails = {
    openai: process.env.OPENAI_API_KEY ? "Configured ✅" : "Not found ❌",
    openrouter: process.env.OPENROUTER_API_KEY ? "Configured ✅" : "Not found ❌",
    deepinfra: process.env.DEEPINFRA_API_KEY ? "Configured ✅" : "Not found ❌",
  }

  return NextResponse.json({
    message: "Actual API Key Status Check",
    keys: actualKeys,
    details: keyDetails,
    summary: {
      totalConfigured: Object.values(actualKeys).filter(Boolean).length,
      workingSetup: actualKeys.openai || actualKeys.openrouter ? "Yes" : "No",
      recommendation:
        actualKeys.openai && actualKeys.openrouter
          ? "You have both OpenAI and OpenRouter - perfect setup!"
          : actualKeys.openai
            ? "OpenAI only - works great"
            : actualKeys.openrouter
              ? "OpenRouter only - works great"
              : "Need to configure at least one AI provider",
    },
  })
}
