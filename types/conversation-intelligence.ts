export interface ConversationCapture {
  id: string
  platform: "chatgpt" | "claude" | "v0" | "copilot" | "custom"
  timestamp: Date
  participants: string[]
  content: ConversationMessage[]
  context: {
    project?: string
    topic?: string
    intent?: string
  }
  insights?: AIInsight[]
}

export interface ConversationMessage {
  id: string
  sender: "user" | "ai" | string
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    tokens?: number
    confidence?: number
  }
}

export interface AIInsight {
  id: string
  type: "pattern" | "innovation" | "practical" | "contradiction" | "opportunity"
  description: string
  relevance: number
  sourceConversations: string[]
  suggestedActions?: string[]
}

export interface VisionEvolution {
  id: string
  timestamp: Date
  description: string
  keyInsights: AIInsight[]
  practicalSteps: string[]
  originalityScore: number
  feasibilityScore: number
}
