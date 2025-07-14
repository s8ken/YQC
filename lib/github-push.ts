interface FileUpdate {
  path: string
  content: string
}

export async function pushToGitHub(files: FileUpdate[], message?: string) {
  try {
    const response = await fetch("/api/push-to-github", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files,
        message: message || `Auto-update from Vercel - ${new Date().toISOString()}`,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to push to GitHub")
    }

    return result
  } catch (error) {
    console.error("Error in pushToGitHub:", error)
    throw error
  }
}
