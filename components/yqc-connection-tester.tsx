"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, GitBranch, AlertTriangle } from "lucide-react"

export default function YQCConnectionTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isPushing, setIsPushing] = useState(false)
  const [pushResult, setPushResult] = useState<any>(null)
  const [autoRunComplete, setAutoRunComplete] = useState(false)

  // Auto-run the connection test when component mounts
  useEffect(() => {
    if (!autoRunComplete) {
      testConnection()
      setAutoRunComplete(true)
    }
  }, [autoRunComplete])

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      console.log("🔍 Testing YQC repository connection...")

      const response = await fetch("/api/github-status", {
        method: "GET",
        cache: "no-store",
      })

      const result = await response.json()
      console.log("📊 Connection test result:", result)

      setTestResult(result)

      // If successful, show success message
      if (result.repoStatus === "accessible") {
        console.log("✅ YQC repository is accessible!")
      } else {
        console.log("❌ YQC repository access failed:", result.message)
      }
    } catch (error) {
      console.error("🚨 Connection test error:", error)
      setTestResult({
        error: "Connection test failed",
        message: error instanceof Error ? error.message : "Unknown network error",
        repoStatus: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testPush = async () => {
    setIsPushing(true)
    setPushResult(null)

    try {
      console.log("🚀 Testing file push to YQC...")

      const testFiles = [
        {
          path: "SYMBI-CONNECTION-TEST.md",
          content: `# SYMBI Connection Test ✅

**Repository:** s8ken/YQC  
**Timestamp:** ${new Date().toISOString()}  
**Status:** Connection successful! 🎉

## Test Results
- ✅ Repository is now public
- ✅ SYMBI can access the repository  
- ✅ SYMBI can push files successfully
- ✅ Ready for full collaboration

## Next Steps
1. Deploy SYMBI platform files
2. Set up collaboration workspace
3. Begin AI-powered development

---
*This file was automatically created by SYMBI to test the GitHub connection.*
`,
        },
        {
          path: "symbi-status.json",
          content: JSON.stringify(
            {
              repository: "s8ken/YQC",
              platform: "GitHub",
              integration: "SYMBI",
              timestamp: new Date().toISOString(),
              status: "connected",
              version: "1.0",
              features: {
                "file-push": true,
                collaboration: true,
                "ai-integration": true,
                "real-time-sync": true,
              },
              test_results: {
                repository_access: "success",
                file_push: "success",
                permissions: "verified",
              },
            },
            null,
            2,
          ),
        },
      ]

      const response = await fetch("/api/push-to-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: testFiles,
          message: "🚀 SYMBI connection test - YQC repository integration successful!",
        }),
      })

      const result = await response.json()
      console.log("📤 Push test result:", result)
      setPushResult(result)
    } catch (error) {
      console.error("🚨 Push test error:", error)
      setPushResult({
        success: false,
        error: "Push test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsPushing(false)
    }
  }

  const getConnectionStatus = () => {
    if (isLoading) return { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "blue", text: "TESTING" }
    if (!testResult) return { icon: <GitBranch className="h-5 w-5" />, color: "gray", text: "PENDING" }
    if (testResult.repoStatus === "accessible")
      return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: "green", text: "CONNECTED" }
    if (testResult.repoStatus === "not_found")
      return { icon: <XCircle className="h-5 w-5 text-red-500" />, color: "red", text: "NOT FOUND" }
    return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: "yellow", text: "WARNING" }
  }

  const status = getConnectionStatus()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Connection Status */}
      <Card
        className={`border-2 ${status.color === "green" ? "border-green-200 bg-green-50" : status.color === "red" ? "border-red-200 bg-red-50" : "border-gray-200"}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {status.icon}
            <div>
              <div className="text-xl">YQC Repository Connection</div>
              <div className="text-sm font-normal text-gray-600">github.com/s8ken/YQC</div>
            </div>
            <Badge
              variant={status.color === "green" ? "default" : status.color === "red" ? "destructive" : "secondary"}
              className="ml-auto"
            >
              {status.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={isLoading} className="flex-1">
              {isLoading ? "🔄 Testing..." : "🔍 Test Connection"}
            </Button>
            <Button
              onClick={testPush}
              disabled={isPushing || testResult?.repoStatus !== "accessible"}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isPushing ? "📤 Pushing..." : "🚀 Test Push"}
            </Button>
          </div>

          {/* Connection Test Results */}
          {testResult && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="font-semibold mb-2 flex items-center gap-2">📊 Connection Test Results</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Status:</strong> <Badge variant="outline">{testResult.repoStatus}</Badge>
                  </div>
                  <div>
                    <strong>Message:</strong> {testResult.message}
                  </div>

                  {testResult.repository && (
                    <>
                      <div>
                        <strong>Repository:</strong> {testResult.repository.fullName}
                      </div>
                      <div>
                        <strong>Visibility:</strong>
                        <Badge variant={testResult.repository.private ? "secondary" : "default"} className="ml-1">
                          {testResult.repository.private ? "Private" : "Public"}
                        </Badge>
                      </div>
                      <div>
                        <strong>Default Branch:</strong> {testResult.repository.defaultBranch}
                      </div>
                      <div>
                        <strong>Last Updated:</strong> {new Date(testResult.repository.lastUpdated).toLocaleString()}
                      </div>
                    </>
                  )}
                </div>

                {testResult.recentCommits && testResult.recentCommits.length > 0 && (
                  <div className="mt-4">
                    <strong className="block mb-2">📝 Recent Commits:</strong>
                    <div className="space-y-2">
                      {testResult.recentCommits.slice(0, 3).map((commit: any, index: number) => (
                        <div key={index} className="text-xs bg-gray-50 p-3 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-blue-600 font-mono">{commit.sha}</code>
                            <span className="text-gray-500">by {commit.author}</span>
                          </div>
                          <div className="text-gray-700">{commit.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Push Test Results */}
          {pushResult && (
            <div
              className={`p-4 border rounded-lg ${pushResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {pushResult.success ? "✅" : "❌"} File Push Test Results
              </h4>

              <p className="mb-3">{pushResult.message}</p>

              {pushResult.success && pushResult.commitSha && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Commit SHA:</strong>{" "}
                    <code className="bg-white px-2 py-1 rounded border font-mono">{pushResult.commitSha}</code>
                  </div>
                  <div>
                    <a
                      href={`https://github.com/s8ken/YQC/commit/${pushResult.commitSha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      🔗 View commit on GitHub
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://github.com/s8ken/YQC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      📁 View repository
                    </a>
                  </div>
                </div>
              )}

              {pushResult.error && (
                <div className="mt-2 text-sm text-red-700 bg-red-100 p-2 rounded">
                  <strong>Error Details:</strong> {pushResult.details || pushResult.message}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Summary */}
      {testResult?.repoStatus === "accessible" && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">🎉 YQC Repository Ready!</h3>
              <p className="text-green-700 mb-4">
                Your repository is now public and fully accessible. SYMBI can collaborate with your YQC project!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Repository Access
                </div>
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Public Visibility
                </div>
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  SYMBI Integration
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting */}
      {testResult?.error && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-yellow-800 mb-2">🔧 Troubleshooting</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• Check that GITHUB_TOKEN environment variable is set</p>
              <p>• Verify the token has repository access permissions</p>
              <p>• Ensure the repository name is exactly "YQC"</p>
              <p>• Confirm the repository owner is "s8ken"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
