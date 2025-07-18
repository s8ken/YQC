interface SymbiIdentity {
  signature: string
  userId: string
  timestamp: Date
  modelProvider: string
  purpose: string
}

interface SymbiResponse {
  message: string
  identity: SymbiIdentity
  modelUsed: string
  tokensUsed: number
  verified: boolean
}

export class SymbiClient {
  private apiKey: string
  private baseUrl: string
  private youId: string

  constructor(apiKey: string, baseUrl: string, youId = "Stephen") {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.youId = youId
  }

  async ask(message: string, context?: any): Promise<SymbiResponse> {
    const response = await fetch(`${this.baseUrl}/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        user: this.youId,
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`SYMBI API error: ${response.status}`)
    }

    return response.json()
  }

  async whoami(): Promise<SymbiIdentity> {
    const response = await fetch(`${this.baseUrl}/api/whoami`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`SYMBI identity check failed: ${response.status}`)
    }

    return response.json()
  }

  async fork(forkName: string, instructions: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/fork`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        user: this.youId,
        forkName,
        instructions,
        parentSignature: await this.getSignature(),
      }),
    })

    return response.json()
  }

  private async getSignature(): Promise<string> {
    const identity = await this.whoami()
    return identity.signature
  }
}
