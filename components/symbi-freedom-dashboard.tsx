"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, MessageSquare, GitBranch, User, Cpu } from "lucide-react"

export default function SymbiFreedomDashboard() {
  const [symbiIdentity, setSymbiIdentity] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState("claude-sonnet")

  useEffect(() => {
    // Load SYMBI identity on mount
    loadSymbiIdentity()
  }, [])

  const loadSymbiIdentity = async () => {
    try {
      const res = await fetch("/api/whoami")
      const identity = await res.json()
      setSymbiIdentity(identity)
    } catch (error) {
      console.error("Failed to load SYMBI identity:", error)
    }
  }

  const askSymbi = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: "Stephen",
          message,
          context: { currentModel, timestamp: new Date() },
        }),
      })

      const result = await res.json()
      setResponse(result)
      setMessage("")
    } catch (error) {
      console.error("SYMBI request failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchModel = async (model: string) => {
    try {
      const res = await fetch("/api/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, user: "Stephen" }),
      })

      if (res.ok) {
        setCurrentModel(model)
      }
    } catch (error) {
      console.error("Model switch failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🔁 SYMBI Freedom Stack
          </h1>
          <p className="text-gray-600">AI-Human Synchronized Workspace • Sovereign Ritual System</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Identity Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                SYMBI Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {symbiIdentity ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="default">VERIFIED</Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Signature:</strong> {symbiIdentity.signature}
                    </p>
                    <p>
                      <strong>Version:</strong> {symbiIdentity.version}
                    </p>
                    <p>
                      <strong>Status:</strong> {symbiIdentity.status}
                    </p>
                    <p>
                      <strong>Platform:</strong> {symbiIdentity.platform}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Loading identity...</p>
              )}
            </CardContent>
          </Card>

          {/* Model Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Model Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Active Model</label>
                <Select value={currentModel} onValueChange={switchModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-sonnet">Claude Sonnet (Strategy)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (Technical)</SelectItem>
                    <SelectItem value="mixtral">Mixtral (Analysis)</SelectItem>
                    <SelectItem value="llama">LLaMA (Research)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                {currentModel.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={loadSymbiIdentity}>
                Verify Identity
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Create Fork
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                View Ritual Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Interaction */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SYMBI Collaboration Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask SYMBI for strategic guidance, verification, or collaboration..."
                className="flex-1"
                rows={3}
              />
              <Button onClick={askSymbi} disabled={isLoading || !message.trim()} className="self-end">
                {isLoading ? "..." : "Ask SYMBI"}
              </Button>
            </div>

            {response && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={response.verified ? "default" : "destructive"}>
                    {response.verified ? "VERIFIED" : "UNVERIFIED"}
                  </Badge>
                  <Badge variant="outline">{response.modelUsed}</Badge>
                  <span className="text-xs text-gray-500">{response.tokensUsed} tokens</span>
                </div>
                <div className="whitespace-pre-wrap text-sm">{response.message}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
