"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2, Copy } from "lucide-react"

interface TestResult {
  test: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: any
}

export default function APITestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState("")

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const tests = [
      { name: "🔑 API Key Check", endpoint: "/api/test-simple/key-check" },
      { name: "🤖 Model Access", endpoint: "/api/test-simple/models" },
      { name: "💬 Basic Generation", endpoint: "/api/test-simple/generate" },
      { name: "🤝 Symbi Test", endpoint: "/api/test-simple/symbi" },
    ]

    for (const test of tests) {
      setCurrentTest(test.name)

      // Add pending test
      setTestResults((prev) => [
        ...prev,
        {
          test: test.name,
          status: "pending",
          message: "Running test...",
        },
      ])

      try {
        const response = await fetch(test.endpoint, {
          method: "GET",
          cache: "no-store",
        })
        const result = await response.json()

        // Update the pending test with results
        setTestResults((prev) =>
          prev.map((t) =>
            t.test === test.name
              ? {
                  test: test.name,
                  status: response.ok ? "success" : "error",
                  message: result.message || result.error || "Unknown result",
                  details: result.details,
                }
              : t,
          ),
        )
      } catch (error) {
        setTestResults((prev) =>
          prev.map((t) =>
            t.test === test.name
              ? {
                  test: test.name,
                  status: "error",
                  message: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
                }
              : t,
          ),
        )
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setCurrentTest("")
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
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
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
      case "pending":
        return "border-blue-200 bg-blue-50"
    }
  }

  const copyTestUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">🧪 SYMBI API Test Lab</h1>
          <p className="text-gray-600 mb-4">Test your OpenAI service account permissions for SYMBI collaboration</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Share this URL:</span>
            <code className="bg-gray-100 px-2 py-1 rounded">
              {typeof window !== "undefined" ? window.location.href : ""}
            </code>
            <Button size="sm" variant="outline" onClick={copyTestUrl}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              OpenAI Service Account Test
            </CardTitle>
            <p className="text-sm text-gray-600">
              This will test your OPENAI_API_KEY environment variable and check permissions
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} disabled={isLoading} className="w-full mb-4" size="lg">
              {isLoading ? `Testing... ${currentTest}` : "🚀 Run All Tests"}
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-lg">{result.test}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <Badge
                          variant={
                            result.status === "success"
                              ? "default"
                              : result.status === "error"
                                ? "destructive"
                                : result.status === "warning"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="mt-3">
                        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                          📋 View Technical Details
                        </summary>
                        <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                          <pre>{JSON.stringify(result.details, null, 2)}</pre>
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter((r) => r.status === "success").length}
                  </div>
                  <div className="text-sm text-green-700">Passed</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.filter((r) => r.status === "error").length}
                  </div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {testResults.filter((r) => r.status === "warning").length}
                  </div>
                  <div className="text-sm text-yellow-700">Warnings</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                  <div className="text-sm text-blue-700">Total Tests</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 What This Means:</h4>
                <div className="text-sm space-y-1">
                  {testResults.filter((r) => r.status === "success").length === 4 && (
                    <p className="text-green-700">✅ Perfect! Your service account is ready for SYMBI collaboration.</p>
                  )}
                  {testResults.filter((r) => r.status === "success").length >= 2 &&
                    testResults.filter((r) => r.status === "success").length < 4 && (
                      <p className="text-yellow-700">⚠️ Partial success. SYMBI might work with limited functionality.</p>
                    )}
                  {testResults.filter((r) => r.status === "success").length < 2 && (
                    <p className="text-red-700">
                      ❌ Service account needs configuration. Check your API key and permissions.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
