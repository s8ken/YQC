import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { ConversationCapture, AIInsight, VisionEvolution } from "./types" // Assuming these types are declared in a separate file

const InsightSchema = z.object({
  insights: z.array(
    z.object({
      type: z.enum(["pattern", "innovation", "practical", "contradiction", "opportunity"]),
      description: z.string(),
      relevance: z.number().min(0).max(1),
      suggestedActions: z.array(z.string()),
    }),
  ),
})

export class InsightEngine {
  static async analyzeConversations(conversations: ConversationCapture[]): Promise<AIInsight[]> {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: InsightSchema,
      prompt: `Analyze these conversations and extract key insights:
      
      ${conversations
        .map(
          (conv) => `
        Platform: ${conv.platform}
        Context: ${conv.context.topic}
        Messages: ${conv.content.map((m) => `${m.sender}: ${m.content}`).join("\n")}
      `,
        )
        .join("\n---\n")}
      
      Focus on:
      1. PATTERNS - Recurring themes across conversations
      2. INNOVATIONS - Novel ideas or approaches
      3. PRACTICAL - Actionable steps or solutions
      4. CONTRADICTIONS - Conflicting viewpoints to resolve
      5. OPPORTUNITIES - Unexplored potential
      
      Rate relevance 0-1 and suggest specific actions.`,
    })

    return object.insights.map((insight, index) => ({
      id: `insight-${Date.now()}-${index}`,
      ...insight,
      sourceConversations: conversations.map((c) => c.id),
    }))
  }

  static async evolveVision(previousVision: VisionEvolution, newInsights: AIInsight[]): Promise<VisionEvolution> {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        description: z.string(),
        practicalSteps: z.array(z.string()),
        originalityScore: z.number().min(0).max(1),
        feasibilityScore: z.number().min(0).max(1),
      }),
      prompt: `Previous vision: ${previousVision.description}
      
      New insights: ${newInsights.map((i) => `${i.type}: ${i.description}`).join("\n")}
      
      Evolve the vision by:
      1. Integrating new insights
      2. Identifying practical next steps
      3. Rating originality (how novel/unique)
      4. Rating feasibility (how achievable)
      
      Keep the core vision but refine based on new learnings.`,
    })

    return {
      id: `vision-${Date.now()}`,
      timestamp: new Date(),
      keyInsights: newInsights,
      ...object,
    }
  }
}
