import type { ConversationMessage } from "./types" // Assuming ConversationMessage is defined in a types file

export class ConversationCapture {
  // Browser extension integration
  static async captureFromBrowser(data: any) {
    return await fetch("/api/capture/browser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: data.platform,
        url: data.url,
        conversation: data.messages,
        timestamp: new Date(),
      }),
    })
  }

  // API webhook integration
  static async captureFromWebhook(platform: string, data: any) {
    return await fetch("/api/capture/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CAPTURE_API_KEY}`,
      },
      body: JSON.stringify({
        platform,
        conversation: data,
        encrypted: true,
      }),
    })
  }

  // Real-time capture during live conversations
  static async captureLive(conversationId: string, message: ConversationMessage) {
    return await fetch(`/api/conversations/${conversationId}/capture`, {
      method: "POST",
      body: JSON.stringify(message),
    })
  }
}
