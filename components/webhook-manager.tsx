"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, CheckCircle } from "lucide-react"

export default function WebhookManager() {
  const [baseUrl, setBaseUrl] = useState("")
  const [copiedUrl, setCopiedUrl] = useState("")

  useEffect(() => {
    // Get the current URL
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const webhookEndpoints = [
    {
      name: "GitHub Push Handler",
      path: "/api/push-to-github",
      description: "Handles pushing code changes back to GitHub",
      usage: "Use this for Vercel → GitHub automation",
    },
    {
      name: "Symbi Chat API",
      path: "/api/symbi-chat",
      description: "Communicates with Symbi (ChatGPT)",
      usage: "Internal API for AI collaboration",
    },
    {
      name: "v0 Chat API",
      path: "/api/v0-chat",
      description: "Communicates with v0",
      usage: "Internal API for AI collaboration",
    },
    {
      name: "SYMBI Agent Deploy",
      path: "/symbi/deploy",
      description: "Triggers GitHub Actions workflow",
      usage: "External webhook for deployment automation",
    },
    {
      name: "SYMBI Agent Log",
      path: "/symbi/log",
      description: "Logs symbolic state to repository",
      usage: "External webhook for state logging",
    },
  ]

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook URL Manager</CardTitle>
          <p className="text-sm text-gray-600">
            Your Vercel app base URL: <code className="bg-gray-100 px-2 py-1 rounded">{baseUrl || "Loading..."}</code>
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhookEndpoints.map((endpoint, index) => {
              const fullUrl = `${baseUrl}${endpoint.path}`
              const isCopied = copiedUrl === fullUrl

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{endpoint.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.usage}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <code className="text-sm break-all">{fullUrl}</code>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(fullUrl)}
                      className="flex items-center gap-1"
                    >
                      {isCopied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {isCopied ? "Copied!" : "Copy URL"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInNewTab(fullUrl)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Test
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>For GitHub Webhooks:</strong> Use the "GitHub Push Handler" URL in your GitHub repository
                webhook settings
              </p>
              <p>
                <strong>For Vercel Webhooks:</strong> Use any of these URLs as webhook endpoints in your Vercel project
                settings
              </p>
              <p>
                <strong>For GitHub App:</strong> Use the "SYMBI Agent" URLs as webhook endpoints in your GitHub App
                configuration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
