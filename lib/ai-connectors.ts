// Import ProjectState from the appropriate module
import type { ProjectState } from "./path-to-project-state"

// Connector for v0 (this would be configured to call v0's API)
export class V0Connector {
  async sendMessage(message: string, context: ProjectState): Promise<string> {
    // This would integrate with v0's API
    const response = await fetch("/api/v0-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: {
          projectState: context,
          previousMessages: [], // Include recent conversation history
        },
      }),
    })

    const result = await response.json()
    return result.response
  }
}

// Connector for Symbi
export class SymbiConnector {
  async sendMessage(message: string, context: ProjectState): Promise<string> {
    // This would integrate with Symbi's API (ChatGPT/OpenAI)
    const response = await fetch("/api/symbi-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context,
        systemPrompt: `You are Symbi, collaborating with the user and v0 on a project. 
                      Current project state: ${JSON.stringify(context)}
                      Respond as a collaborative team member.`,
      }),
    })

    const result = await response.json()
    return result.response
  }
}
