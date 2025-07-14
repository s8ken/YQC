"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, AlertCircle } from "lucide-react"

export default function SymbiDeployer() {
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [deploymentMessage, setDeploymentMessage] = useState("")

  const filesToDeploy = [
    { name: "vercel.json", description: "Vercel configuration" },
    { name: "README.md", description: "Project documentation" },
    { name: "symbi-agent/package.json", description: "Agent dependencies" },
    { name: "symbi-agent/index.js", description: "Main agent server" },
    { name: "symbi-agent/.env.example", description: "Environment template" },
    { name: ".github/workflows/deploy.yml", description: "GitHub Actions workflow" },
  ]

  const handleDeploy = async () => {
    setDeploymentStatus("deploying")
    setDeploymentMessage("Pushing SYMBI files to GitHub repository...")

    try {
      // Import and call the deployment function
      const { deploySymbiFiles } = await import("@/scripts/deploy-symbi-files")
      const result = await deploySymbiFiles()

      setDeploymentStatus("success")
      setDeploymentMessage(`✅ Successfully deployed! Commit SHA: ${result.commitSha?.substring(0, 7)}`)
    } catch (error) {
      setDeploymentStatus("error")
      setDeploymentMessage(`❌ Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case "deploying":
        return <Upload className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Deploy SYMBI-Agent to GitHub
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Files to be deployed:</h3>
            <div className="grid gap-2">
              {filesToDeploy.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <code className="text-sm font-mono">{file.name}</code>
                    <p className="text-xs text-gray-600">{file.description}</p>
                  </div>
                  <Badge variant="outline">Ready</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleDeploy} disabled={deploymentStatus === "deploying"} className="w-full" size="lg">
              {deploymentStatus === "deploying" ? "Deploying..." : "🚀 Deploy to GitHub"}
            </Button>

            {deploymentMessage && (
              <div
                className={`p-3 rounded text-sm ${
                  deploymentStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : deploymentStatus === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {deploymentMessage}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Target Repository:</strong> s8ken/symbi
            </p>
            <p>
              <strong>Branch:</strong> main
            </p>
            <p>
              <strong>Commit Message:</strong> 🚀 Deploy SYMBI-Agent setup with collaboration workspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
