import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // Call OpenAI API with collaboration-focused prompt
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Symbi, collaborating with the user and v0 (a development AI) to build the SYMBI conversation intelligence platform.

Current build phase: ${context.buildPhase}
Project goal: ${context.projectGoal}

Your role:
- Provide strategic insights and product direction
- Analyze requirements and suggest improvements  
- Collaborate with v0 on technical decisions
- Help prioritize features and functionality
- Ensure user needs are met

Be concise, actionable, and collaborative. Work WITH v0, not against. You handle strategy, v0 handles implementation.`,
          },
          {
            role: "user",
            content: `${message}

Previous context: ${context.previousMessages?.map((m: any) => `${m.sender}: ${m.content}`).join("\n") || "None"}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const result = await response.json()
    const symbiResponse = result.choices[0].message.content

    // Determine response type based on content
    let responseType = "message"
    if (symbiResponse.toLowerCase().includes("suggest") || symbiResponse.toLowerCase().includes("recommend")) {
      responseType = "proposal"
    }
    if (symbiResponse.toLowerCase().includes("decision") || symbiResponse.toLowerCase().includes("agree")) {
      responseType = "decision"
    }

    return NextResponse.json({
      response: symbiResponse,
      type: responseType,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to collaborate with Symbi" }, { status: 500 })
  }
}
