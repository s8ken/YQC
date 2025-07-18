"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react"

export default function ConnectionStatusDisplay() {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github-status", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const result = await response.json()
      setStatus(result)
      setLastChecked(new Date())

      // Log the results for debugging
      console.log("🔍 YQC Connection Status:", result)
    } catch (error) {
      console.error("❌ Status check failed:", error)
      setStatus({
        error: "Status check failed",
        message: error instanceof Error ? error.message : "Unknown error",
        repoStatus: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    if (!status) return <AlertTriangle className="h-6 w-6 text-gray-500" />

    switch (status.repoStatus) {
      case "accessible":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "not_found":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "access_denied":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      default:
        return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (isLoading) return "border-blue-200 bg-blue-50"
    if (!status || status.error) return "border-red-200 bg-red-50"

    switch (status.repoStatus) {
      case "accessible":
        return "border-green-200 bg-green-50"
      case "not_found":
        return "border-red-200 bg-red-50"
      case "access_denied":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getStatusText = () => {
    if (isLoading) return "Checking connection..."
    if (!status) return "No status available"
    if (status.error) return status.message

    switch (status.repoStatus) {
      case "accessible":
        return "✅ Repository is accessible and ready!"
      case "not_found":
        return "❌ Repository not found or not accessible"
      case "access_denied":
        return "⚠️ Access denied - check permissions"
      default:
        return status.message || "Unknown status"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <div className="text-xl">YQC Repository Status</div>
                <div className="text-sm font-normal text-gray-600">github.com/s8ken/YQC</div>
              </div>
            </div>
            <Button onClick={checkStatus} disabled={isLoading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">{getStatusText()}</div>

          {lastChecked && <div className="text-sm text-gray-500">Last checked: {lastChecked.toLocaleTimeString()}</div>}

          {status && !status.error && (
            <div className="grid gap-4">
              {/* Repository Details */}
              {status.repository && (
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-3">📁 Repository Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Full Name:</strong> {status.repository.fullName}
                    </div>
                    <div>
                      <strong>Visibility:</strong>{" "}
                      <Badge variant={status.repository.private ? "secondary" : "default"}>
                        {status.repository.private ? "Private" : "Public"}
                      </Badge>
                    </div>
                    <div>
                      <strong>Default Branch:</strong> {status.repository.defaultBranch}
                    </div>
                    <div>
                      <strong>Last Updated:</strong> {new Date(status.repository.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {status.recentCommits && status.recentCommits.length > 0 && (
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-3">📝 Recent Commits</h4>
                  <div className="space-y-2">
                    {status.recentCommits.slice(0, 5).map((commit: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">{commit.sha}</code>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{commit.message}</div>
                          <div className="text-xs text-gray-500">
                            by {commit.author} • {new Date(commit.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connection Summary */}
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-3">🔗 Connection Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {status.repoStatus === "accessible" ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium">Repository Access</div>
                      <div className="text-gray-500">{status.repoStatus === "accessible" ? "Connected" : "Failed"}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {status.repository?.private === false ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium">Public Visibility</div>
                      <div className="text-gray-500">
                        {status.repository?.private === false ? "Public" : "Private/Unknown"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {status.repoStatus === "accessible" ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium">SYMBI Ready</div>
                      <div className="text-gray-500">{status.repoStatus === "accessible" ? "Ready" : "Not Ready"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Details */}
          {status?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">❌ Connection Error</h4>
              <p className="text-red-700 mb-3">{status.message}</p>

              {status.suggestions && (
                <div>
                  <strong className="text-red-800">Suggestions:</strong>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                    {status.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {status?.repoStatus === "accessible" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <h4 className="font-semibold text-green-800 mb-2">🎉 Connection Successful!</h4>
              <p className="text-green-700">
                Your YQC repository is now accessible and ready for SYMBI integration. The "eternal changes messaging"
                issue should be resolved!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Status Data (for debugging) */}
      {status && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">🔧 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <details className="text-xs">
              <summary className="cursor-pointer font-medium mb-2">View Raw Status Data</summary>
              <pre className="bg-white p-3 rounded border overflow-auto">{JSON.stringify(status, null, 2)}</pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
