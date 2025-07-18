// Update GitHub configuration for YQC repository
export const GITHUB_CONFIG = {
  REPO_OWNER: "s8ken",
  REPO_NAME: "YQC", // Updated from "symbi" to "YQC"
  REPO_URL: "https://github.com/s8ken/YQC",
  BRANCH: "main",
}

export function getRepoPath(path = "") {
  return `${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}${path ? `/${path}` : ""}`
}
