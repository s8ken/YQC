import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if API key is still present
    const apiKeyPresent = !!process.env.DEEPINFRA_API_KEY
    const apiKeyValue = process.env.DEEPINFRA_API_KEY

    // Check environment variables for any DeepInfra traces
    const envVars = {
      DEEPINFRA_API_KEY: apiKeyPresent ? "PRESENT (should be removed)" : "NOT FOUND ✅",
      DEEPINFRA_API_URL: process.env.DEEPINFRA_API_URL || "Not set",
      DEEPINFRA_MODEL: process.env.DEEPINFRA_MODEL || "Not set",
    }

    // Audit results
    const auditResults = {
      timestamp: new Date().toISOString(),
      apiKeyStatus: {
        present: apiKeyPresent,
        removed: !apiKeyPresent,
        partialKey: apiKeyValue ? `${apiKeyValue.substring(0, 8)}...` : "None",
      },
      environmentVariables: envVars,
      securityStatus: {
        keyRemoved: !apiKeyPresent,
        noTraces: !process.env.DEEPINFRA_API_URL && !process.env.DEEPINFRA_MODEL,
        recommendation: !apiKeyPresent ? "✅ Clean - no API key found" : "⚠️ API key still present",
      },
      nextSteps: !apiKeyPresent
        ? [
            "✅ API key successfully removed",
            "Check DeepInfra dashboard for usage history",
            "Review billing for any unexpected charges",
            "Monitor for any unauthorized access attempts",
          ]
        : [
            "❌ Remove DEEPINFRA_API_KEY from environment variables",
            "Check Vercel dashboard environment settings",
            "Regenerate API key on DeepInfra if compromised",
          ],
    }

    return NextResponse.json({
      message: "DeepInfra Security Audit Complete",
      audit: auditResults,
      status: !apiKeyPresent ? "SECURE" : "NEEDS_CLEANUP",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Audit failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
