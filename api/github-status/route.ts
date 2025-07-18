import { NextResponse } from "next/server"
import { GITHUB_CONFIG } from "@/lib/github-config"

export async function GET() {
  try {
    const { REPO_OWNER, REPO_NAME } = GITHUB_CONFIG
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN

    if (!GITHUB_TOKEN) {
      return NextResponse.json({
        error: "GitHub token not configured",
        repoStatus: "unknown",
        message: "GITHUB_TOKEN environment variable missing",
      })
    }

    // Check if repository exists and is accessible
    const repoResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (repoResponse.status === 404) {
      return NextResponse.json({
        error: "Repository not found",
        repoStatus: "not_found",
        message: `Repository ${REPO_OWNER}/${REPO_NAME} does not exist or is not accessible`,
        suggestions: [
          "Check if the repository name is correct",
          "Verify the repository is public or you have access",
          "Create the repository if it doesn't exist",
        ],
      })
    }

    if (!repoResponse.ok) {
      return NextResponse.json({
        error: "Repository access failed",
        repoStatus: "access_denied",
        message: `HTTP ${repoResponse.status}: Cannot access repository`,
      })
    }

    const repoData = await repoResponse.json()

    // Check recent commits to understand "eternal changes"
    const commitsResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=10`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    const commits = commitsResponse.ok ? await commitsResponse.json() : []

    return NextResponse.json({
      repoStatus: "accessible",
      repository: {
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private,
        defaultBranch: repoData.default_branch,
        lastUpdated: repoData.updated_at,
      },
      recentCommits: commits.slice(0, 5).map((commit: any) => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
      })),
      message: "Repository is accessible and ready for SYMBI integration",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "GitHub status check failed",
        repoStatus: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
