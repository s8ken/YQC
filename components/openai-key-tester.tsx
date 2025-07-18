"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface TestResult {
  test: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function OpenAIKeyTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const tests = [
      { name: "API Key Validation", endpoint: "/api/test-openai/validate" },
      { name: "Model Access Check", endpoint: "/api/test-openai/models" },
      { name: "Simple Generation Test", endpoint: "/api/test-openai/generate" },
      { name: "Symbi Collaboration Test", endpoint: "/api/test-openai/symbi" },
    ]

    for (const test of tests) {
      try {
        const response = await fetch(test.endpoint, { method: "POST" })
        const result = await response.json()

        setTestResults((prev) => [
          ...prev,
          {
            test: test.name,
            status: response.ok ? "success" : "error",
            message: result.message || result.error || "Unknown result",
            details: result.details,
          },
        ])
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            test: test.name,
            status: "error",
            message: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ])
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsLoading(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          OpenAI API Key Tester
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test your OpenAI API key access and verify Symbi collaboration capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={isLoading} className="w-full">
          {isLoading ? "Running Tests..." : "Test OpenAI Access"}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.test}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <Badge variant={result.status === "success" ? "default" : "destructive"}>{result.status}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {testResults.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Summary:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>✅ Successful tests: {testResults.filter((r) => r.status === "success").length}</p>
              <p>❌ Failed tests: {testResults.filter((r) => r.status === "error").length}</p>
              <p>⚠️ Warnings: {testResults.filter((r) => r.status === "warning").length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
