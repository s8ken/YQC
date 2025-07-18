"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2, GitBranch } from "lucide-react"

export default function RepoStatusChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [repoStatus, setRepoStatus] = useState<any>(null)

  const checkRepoStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github-status")
      const result = await response.json()
      setRepoStatus(result)
    } catch (error) {
      setRepoStatus({
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!repoStatus) return <GitBranch className="h-5 w-5" />
    if (repoStatus.repoStatus === "accessible") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (repoStatus.repoStatus === "not_found") return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusColor = () => {
    if (!repoStatus) return "border-gray-200 bg-gray-50"
    if (repoStatus.repoStatus === "accessible") return "border-green-200 bg-green-50"
    if (repoStatus.repoStatus === "not_found") return "border-red-200 bg-red-50"
    return "border-yellow-200 bg-yellow-50"
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : getStatusIcon()}
          YQC Repository Status
        </CardTitle>
        <p className="text-sm text-gray-600">
          Target: <code className="bg-gray-100 px-2 py-1 rounded">https://github.com/s8ken/YQC</code>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkRepoStatus} disabled={isLoading} className="w-full">
          {isLoading ? "Checking Repository..." : "🔍 Check YQC Repository Status"}
        </Button>

        {repoStatus && (
          <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon()}
              <Badge
                variant={
                  repoStatus.repoStatus === "accessible"
                    ? "default"
                    : repoStatus.repoStatus === "not_found"
                      ? "destructive"
                      : "secondary"
                }
              >
                {repoStatus.repoStatus?.toUpperCase() || "ERROR"}
              </Badge>
            </div>

            <p className="mb-3">{repoStatus.message}</p>

            {repoStatus.repository && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Repository:</strong> {repoStatus.repository.fullName}
                  </div>
                  <div>
                    <strong>Visibility:</strong> {repoStatus.repository.private ? "Private" : "Public"}
                  </div>
                  <div>
                    <strong>Default Branch:</strong> {repoStatus.repository.defaultBranch}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {new Date(repoStatus.repository.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                {repoStatus.recentCommits && repoStatus.recentCommits.length > 0 && (
                  <div className="mt-4">
                    <strong className="block mb-2">Recent Commits:</strong>
                    <div className="space-y-1">
                      {repoStatus.recentCommits.map((commit: any, index: number) => (
                        <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                          <code>{commit.sha}</code> - {commit.message} by {commit.author}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {repoStatus.suggestions && (
              <div className="mt-4">
                <strong className="block mb-2">Suggestions:</strong>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {repoStatus.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {repoStatus?.repoStatus === "not_found" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Quick Fix Options:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. **Create the repository** at github.com/new</p>
              <p>2. **Check the URL** - maybe it's named differently?</p>
              <p>3. **Make it public** if it's currently private</p>
              <p>4. **Update the repository name** in our configuration</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
