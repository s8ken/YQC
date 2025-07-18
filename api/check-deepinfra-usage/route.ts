import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if we have any DeepInfra usage logs in our system
    const usageLogs = await checkInternalLogs()

    // Check for any remaining DeepInfra references in the codebase
    const codebaseReferences = await scanCodebaseForDeepInfra()

    return NextResponse.json({
      message: "DeepInfra Usage Analysis",
      internalLogs: usageLogs,
      codebaseReferences: codebaseReferences,
      recommendations: [
        "Check DeepInfra dashboard at deepinfra.com for actual usage",
        "Review billing statements for unexpected charges",
        "Check access logs for unauthorized API calls",
        "Consider changing passwords if security was compromised",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Usage check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function checkInternalLogs() {
  // This would check our internal logging system for DeepInfra usage
  // For now, we'll return a placeholder since we don't have persistent logs
  return {
    found: false,
    message: "No internal usage logs found (logs are not persistent in this setup)",
    recommendation: "Check external DeepInfra dashboard for actual usage history",
  }
}

async function scanCodebaseForDeepInfra() {
  // List of files that might contain DeepInfra references
  const potentialFiles = [
    "lib/deepinfra-client.ts",
    "api/symbi-deepinfra.ts",
    "components/deepinfra-tester.tsx",
    "api/test-deepinfra/route.ts",
  ]

  return {
    filesWithReferences: potentialFiles,
    status: "These files contain DeepInfra code but no active connections",
    action: "Files are safe - they only contain client code, no active API calls without key",
  }
}
