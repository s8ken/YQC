import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, files, branch = "main" } = await request.json()

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const REPO_OWNER = process.env.REPO_OWNER || "s8ken" // Updated default
    const REPO_NAME = process.env.REPO_NAME || "YQC" // Updated from 'symbi' to 'YQC'

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return NextResponse.json({ error: "Missing environment variables for YQC repository" }, { status: 400 })
    }

    // Get the current commit SHA
    const refResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${branch}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    const refData = await refResponse.json()
    const currentCommitSha = refData.object.sha

    // Get the current tree
    const commitResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${currentCommitSha}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    const commitData = await commitResponse.json()
    const currentTreeSha = commitData.tree.sha

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async (file: { path: string; content: string }) => {
        const blobResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: Buffer.from(file.content).toString("base64"),
            encoding: "base64",
          }),
        })

        const blobData = await blobResponse.json()
        return {
          path: file.path,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        }
      }),
    )

    // Create new tree
    const treeResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: currentTreeSha,
        tree: blobs,
      }),
    })

    const treeData = await treeResponse.json()

    // Create new commit
    const newCommitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "Auto-commit from Vercel",
        tree: treeData.sha,
        parents: [currentCommitSha],
      }),
    })

    const newCommitData = await newCommitResponse.json()

    // Update the reference
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: newCommitData.sha,
        }),
      },
    )

    if (updateRefResponse.ok) {
      return NextResponse.json({
        success: true,
        commitSha: newCommitData.sha,
        message: "Successfully pushed to GitHub",
      })
    } else {
      throw new Error("Failed to update reference")
    }
  } catch (error) {
    console.error("Error pushing to GitHub:", error)
    return NextResponse.json(
      {
        error: "Failed to push to GitHub",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
