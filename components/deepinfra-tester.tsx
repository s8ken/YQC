"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function DeepInfraTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const runTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-deepinfra")
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
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}🚀 DeepInfra Llama-3.3-70B Test
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test DeepInfra API access and verify Llama-3.3-70B collaboration capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTest} disabled={isLoading} className="w-full">
          {isLoading ? "Testing DeepInfra..." : "🦙 Test Llama-3.3-70B API"}
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
              <span className="font-semibold">{testResult.success ? "DeepInfra Connected!" : "Connection Failed"}</span>
            </div>

            <p className="mb-3">{testResult.message}</p>

            {testResult.details && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Model:</strong> {testResult.details.model}
                  </div>
                  <div>
                    <strong>Tokens Used:</strong> {testResult.details.tokensUsed}
                  </div>
                  <div>
                    <strong>Provider:</strong> {testResult.details.provider}
                  </div>
                  <div>
                    <strong>Pricing:</strong> {testResult.details.pricing}
                  </div>
                </div>

                {testResult.details.capabilities && (
                  <div>
                    <strong className="block mb-1">Available Models:</strong>
                    <div className="flex gap-2">
                      {testResult.details.capabilities.llama33 && <Badge>Llama-3.3 ✅</Badge>}
                      {testResult.details.capabilities.mistral && <Badge>Mistral ✅</Badge>}
                      {testResult.details.capabilities.codeLlama && <Badge>Code Llama ✅</Badge>}
                      {testResult.details.capabilities.openSource && <Badge>Open Source ✅</Badge>}
                    </div>
                  </div>
                )}

                {testResult.details.symbiResponse && (
                  <div>
                    <strong className="block mb-1">SYMBI Test Response:</strong>
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
