# Project Y - GPT-Managed Repository

A Next.js application deployed on Vercel with automated GPT management.

## Features

- 🤖 GPT-powered repository management
- ⚡ Next.js 15 with App Router
- 🚀 Vercel deployment integration
- 🔄 Automated daily updates via GitHub Actions

## Setup Instructions

### 1. Deploy to Vercel
1. Connect this repository to Vercel
2. Use these build settings:
   - Framework: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Configure GitHub Secrets
Add these secrets to your GitHub repository:
- `OPENAI_API_KEY`: Your OpenAI API key

### 3. Enable GitHub Actions
The workflow will automatically run daily or can be triggered manually.

## Architecture

\`\`\`
GitHub Repo → GitHub Actions → GPT API → Code Changes → Commit & Push → Vercel Auto-Deploy
\`\`\`

## License

MIT License - see LICENSE file for details.
