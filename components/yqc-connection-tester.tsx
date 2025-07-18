"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, GitBranch, Upload } from "lucide-react"

export default function YQCConnectionTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isPushing, setIsPushing] = useState(false)
  const [pushResult, setPushResult] = useState<any>(null)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github-status")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        error: "Connection test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testPush = async () => {
    setIsPushing(true)
    try {
      const testFiles = [
        {
          path: "SYMBI-CONNECTION-TEST.md",
          content: `# SYMBI Connection Test

Repository: s8ken/YQC
Timestamp: ${new Date().toISOString()}
Status: Connection successful! 🎉

## Test Details
- Repository is now public ✅
- SYMBI can push files ✅
- Ready for collaboration ✅

This file was automatically created by SYMBI to test the GitHub connection.
`,
        },
        {
          path: "symbi-config.json",
          content: JSON.stringify(
            {
              repository: "s8ken/YQC",
              platform: "GitHub",
              integration: "SYMBI",
              timestamp: new Date().toISOString(),
              status: "active",
              features: ["file-push", "collaboration", "ai-integration"],
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
          message: "🚀 SYMBI connection test - YQC repository is ready!",
        }),
      })

      const result = await response.json()
      setPushResult(result)
    } catch (error) {
      setPushResult({
        error: "Push test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsPushing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            YQC Repository Connection Test
          </CardTitle>
          <p className="text-sm text-gray-600">
            Testing connection to: <code className="bg-gray-100 px-2 py-1 rounded">github.com/s8ken/YQC</code>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing Connection...
                </>
              ) : (
                "🔍 Test Repository Access"
              )}
            </Button>
            <Button
              onClick={testPush}
              disabled={isPushing || !testResult?.repoStatus === "accessible"}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isPushing ? (
                <>
                  <Upload className="h-4 w-4 animate-pulse mr-2" />
                  Pushing Test Files...
                </>
              ) : (
                "🚀 Test File Push"
              )}
            </Button>
          </div>

          {testResult && (
            <div
              className={`border rounded-lg p-4 ${
                testResult.repoStatus === "accessible" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {testResult.repoStatus === "accessible" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={testResult.repoStatus === "accessible" ? "default" : "destructive"}>
                  {testResult.repoStatus?.toUpperCase() || "ERROR"}
                </Badge>
              </div>

              <p className="mb-3 font-medium">{testResult.message}</p>

              {testResult.repository && (
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <strong>Repository:</strong> {testResult.repository.fullName}
                  </div>
                  <div>
                    <strong>Visibility:</strong>{" "}
                    <Badge variant="outline">{testResult.repository.private ? "Private" : "Public"}</Badge>
                  </div>
                  <div>
                    <strong>Default Branch:</strong> {testResult.repository.defaultBranch}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {new Date(testResult.repository.lastUpdated).toLocaleString()}
                  </div>
                </div>
              )}

              {testResult.recentCommits && testResult.recentCommits.length > 0 && (
                <div>
                  <strong className="block mb-2">Recent Activity:</strong>
                  <div className="space-y-1">
                    {testResult.recentCommits.slice(0, 3).map((commit: any, index: number) => (
                      <div key={index} className="text-xs bg-white p-2 rounded border">
                        <code className="text-blue-600">{commit.sha}</code> - {commit.message}
                        <div className="text-gray-500 mt-1">by {commit.author}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {pushResult && (
            <div
              className={`border rounded-lg p-4 ${
                pushResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {pushResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={pushResult.success ? "default" : "destructive"}>
                  {pushResult.success ? "PUSH SUCCESS" : "PUSH FAILED"}
                </Badge>
              </div>

              <p className="mb-2">{pushResult.message}</p>

              {pushResult.commitSha && (
                <div className="text-sm">
                  <strong>Commit SHA:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded border">{pushResult.commitSha}</code>
                  <div className="mt-2">
                    <a
                      href={`https://github.com/s8ken/YQC/commit/${pushResult.commitSha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      🔗 View commit on GitHub
                    </a>
                  </div>
                </div>
              )}

              {pushResult.error && (
                <div className="mt-2 text-sm text-red-700">
                  <strong>Error Details:</strong> {pushResult.details || "Unknown error"}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {testResult?.repoStatus === "accessible" && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">🎉 YQC Repository Ready!</h3>
              <p className="text-sm text-blue-800 mb-4">
                The repository is now public and accessible. SYMBI can collaborate with your YQC project.
              </p>
              <div className="text-xs text-blue-600">
                <p>✅ Repository access confirmed</p>
                <p>✅ Public visibility enabled</p>
                <p>✅ Ready for SYMBI integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
