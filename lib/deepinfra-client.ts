interface DeepInfraResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage?: {
    total_tokens: number
  }
  model: string
}

export class DeepInfraClient {
  private apiKey: string
  private baseUrl = "https://api.deepinfra.com/v1/openai"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(params: {
    model: string
    messages: Array<{ role: string; content: string }>
    temperature?: number
    max_tokens?: number
  }): Promise<DeepInfraResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.max_tokens || 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`DeepInfra API error: ${error.error?.message || "Unknown error"}`)
    }

    return response.json()
  }

  async getModels() {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch models")
    }

    return response.json()
  }
}
