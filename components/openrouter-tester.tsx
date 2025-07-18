"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function OpenRouterTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const runTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-openrouter")
      const result = await response.json()
      setTestResult({ success: response.ok, ...result })
    } catch (error) {
      setTestResult({
        success: false,
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}🌐 OpenRouter Multi-Model Test
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test OpenRouter API access and verify multi-model collaboration capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTest} disabled={isLoading} className="w-full">
          {isLoading ? "Testing OpenRouter..." : "🚀 Test OpenRouter API"}
        </Button>

        {testResult && (
          <div
            className={`border rounded-lg p-4 ${
              testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold">
                {testResult.success ? "OpenRouter Connected!" : "Connection Failed"}
              </span>
            </div>

            <p className="mb-3">{testResult.message}</p>

            {testResult.details && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total Models:</strong> {testResult.details.totalModels}
                  </div>
                  <div>
                    <strong>Tokens Used:</strong> {testResult.details.tokensUsed}
                  </div>
                </div>

                {testResult.details.availableProviders && (
                  <div>
                    <strong className="block mb-1">Available Providers:</strong>
                    <div className="flex gap-2">
                      {testResult.details.availableProviders.openai && <Badge>OpenAI ✅</Badge>}
                      {testResult.details.availableProviders.anthropic && <Badge>Anthropic ✅</Badge>}
                      {testResult.details.availableProviders.google && <Badge>Google ✅</Badge>}
                    </div>
                  </div>
                )}

                {testResult.details.symbiResponse && (
                  <div>
                    <strong className="block mb-1">Symbi Test Response:</strong>
                    <div className="bg-gray-100 p-2 rounded text-sm italic">"{testResult.details.symbiResponse}"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
