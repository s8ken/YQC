"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pushToGitHub } from "@/lib/github-push"

export default function GitHubSync() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")

  const handlePushToGitHub = async () => {
    setIsLoading(true)
    setStatus("")

    try {
      // Example: Push a generated file back to GitHub
      const files = [
        {
          path: "generated/build-info.json",
          content: JSON.stringify(
            {
              buildTime: new Date().toISOString(),
              version: "1.0.0",
              environment: process.env.NODE_ENV,
            },
            null,
            2,
          ),
        },
        {
          path: "README.md",
          content: `# Project Updated\n\nLast updated: ${new Date().toISOString()}\n\nThis file was automatically updated from Vercel.`,
        },
      ]

      const result = await pushToGitHub(files, "Auto-update from Vercel deployment")
      setStatus(`✅ Successfully pushed to GitHub! Commit: ${result.commitSha?.substring(0, 7)}`)
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>GitHub Sync</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handlePushToGitHub} disabled={isLoading} className="w-full">
          {isLoading ? "Pushing to GitHub..." : "Push Changes to GitHub"}
        </Button>

        {status && (
          <div
            className={`text-sm p-2 rounded ${
              status.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
