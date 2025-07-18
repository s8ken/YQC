"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function ActualKeyChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [keyStatus, setKeyStatus] = useState<any>(null)

  const checkKeys = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/verify-actual-keys")
      const result = await response.json()
      setKeyStatus(result)
    } catch (error) {
      setKeyStatus({
        error: "Failed to check keys",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🔑 Actual API Key Status</CardTitle>
        <p className="text-sm text-gray-600">Let's see what you actually have configured (not what I assumed)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkKeys} disabled={isLoading} className="w-full">
          {isLoading ? "Checking..." : "Check What's Actually Configured"}
        </Button>

        {keyStatus && !keyStatus.error && (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {keyStatus.keys.openai ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>OpenAI API Key</span>
                </div>
                <Badge variant={keyStatus.keys.openai ? "default" : "destructive"}>{keyStatus.details.openai}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {keyStatus.keys.openrouter ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>OpenRouter API Key</span>
                </div>
                <Badge variant={keyStatus.keys.openrouter ? "default" : "destructive"}>
                  {keyStatus.details.openrouter}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {keyStatus.keys.deepinfra ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span>DeepInfra API Key</span>
                </div>
                <Badge variant={keyStatus.keys.deepinfra ? "default" : "secondary"}>
                  {keyStatus.details.deepinfra}
                </Badge>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm mb-2">{keyStatus.summary.recommendation}</p>
              <p className="text-xs text-gray-600">Total configured: {keyStatus.summary.totalConfigured}/3 providers</p>
            </div>
          </div>
        )}

        {keyStatus?.error && (
          <div className="border-red-200 bg-red-50 border rounded-lg p-4">
            <p className="text-red-600">{keyStatus.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
