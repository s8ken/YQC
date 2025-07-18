"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Shield, Eye, Trash2 } from "lucide-react"

export default function DeepInfraSecurityAudit() {
  const [auditResult, setAuditResult] = useState<any>(null)
  const [usageResult, setUsageResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runSecurityAudit = async () => {
    setIsLoading(true)
    try {
      // Run both audits simultaneously
      const [auditResponse, usageResponse] = await Promise.all([
        fetch("/api/audit-deepinfra"),
        fetch("/api/check-deepinfra-usage"),
      ])

      const auditData = await auditResponse.json()
      const usageData = await usageResponse.json()

      setAuditResult(auditData)
      setUsageResult(usageData)
    } catch (error) {
      console.error("Audit failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SECURE":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "NEEDS_CLEANUP":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />🔒 DeepInfra Security Audit
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive audit of DeepInfra connections and potential security issues
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={runSecurityAudit} disabled={isLoading} className="w-full mb-4" size="lg">
            {isLoading ? "Running Security Audit..." : "🕵️ Run Complete Security Audit"}
          </Button>

          {auditResult && (
            <div className="space-y-4">
              <Alert
                className={
                  auditResult.status === "SECURE" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(auditResult.status)}
                  <AlertDescription className="font-semibold">Status: {auditResult.status}</AlertDescription>
                </div>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      API Key Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>API Key Present:</span>
                      <Badge variant={auditResult.audit.apiKeyStatus.present ? "destructive" : "default"}>
                        {auditResult.audit.apiKeyStatus.present ? "YES ⚠️" : "NO ✅"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Removed:</span>
                      <Badge variant={auditResult.audit.apiKeyStatus.removed ? "default" : "destructive"}>
                        {auditResult.audit.apiKeyStatus.removed ? "YES ✅" : "NO ❌"}
                      </Badge>
                    </div>
                    {auditResult.audit.apiKeyStatus.partialKey !== "None" && (
                      <div className="text-xs text-gray-500">
                        Partial Key: {auditResult.audit.apiKeyStatus.partialKey}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Environment Clean-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(auditResult.audit.environmentVariables).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{key}:</span>
                        <span className={value === "Not set" ? "text-green-600" : "text-gray-600"}>
                          {value as string}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📋 Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {auditResult.audit.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-gray-400">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {usageResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">📊 Usage Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Internal Logs</h4>
                  <p className="text-sm">{usageResult.internalLogs.message}</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Codebase References</h4>
                  <p className="text-sm mb-2">{usageResult.codebaseReferences.action}</p>
                  <div className="text-xs space-y-1">
                    {usageResult.codebaseReferences.filesWithReferences.map((file: string) => (
                      <div key={file} className="font-mono bg-white px-2 py-1 rounded">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🚨 Important Actions</h4>
                  <ul className="text-sm space-y-1">
                    {usageResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔗 External Audit Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" asChild>
              <a href="https://deepinfra.com/dash" target="_blank" rel="noopener noreferrer">
                📊 Check DeepInfra Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                ⚙️ Check Vercel Environment Variables
              </a>
            </Button>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Manual Steps Required:</strong> Check your DeepInfra dashboard for usage history, billing charges,
              and access logs to understand what happened.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
