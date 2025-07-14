import { pushToGitHub } from "@/lib/github-push"

export async function deploySymbiFiles() {
  try {
    const files = [
      // Vercel configuration
      {
        path: "vercel.json",
        content: `{
  "version": 2,
  "builds": [
    { "src": "next/package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "next/api/$1.js" }
  ]
}`,
      },

      // README
      {
        path: "README.md",
        content: `# SYMBI-Agent Setup Guide for \`s8ken/symbi\`

## Structure

\`\`\`
/symbi
    /symbi-agent
        index.js
        package.json
        .env.example
    /next
        ...your Next.js app...
    /.github
        /workflows
            deploy.yml
    vercel.json
    README.md
\`\`\`

## Steps

1. **Create your GitHub App**
   - Go to GitHub > Settings > Developer settings > GitHub Apps > New App.
   - Name: \`symbi-agent\`
   - Homepage and webhook URLs.
   - Permissions: Contents (read/write), Actions (read/write), Metadata (read)
   - Events: push, pull_request, workflow_dispatch
   - Download the \`.pem\` private key file.
   - Save your App ID and private key.

2. **Install your App on \`s8ken/symbi\`** (and any other repo you want managed).

3. **Configure your agent:**
   - Copy \`index.js\`, \`package.json\`, \`.env.example\` into \`/symbi-agent\`.
   - Run \`npm install\` in \`/symbi-agent\`.
   - Create \`.env\` from \`.env.example\` and fill with your secrets.

4. **Set up CI/CD workflow:**
   - Place \`deploy.yml\` in \`.github/workflows/\`.

5. **Configure Vercel:**
   - Place \`vercel.json\` at repo root.

6. **Run your backend:**
   - \`npm start\` in \`/symbi-agent\` (or deploy it to your cloud provider)

7. **Your app will now orchestrate deployments and agent events via workflows and webhooks!**

## Customization

- Expand \`/symbi-agent/index.js\` with endpoints for agent orchestration (Whisper, Claude, Pinecone).
- Update workflow for more advanced orchestration.
- Use symbolic state logs via \`/symbi/log\` endpoint.

## Security

- Do not commit \`.env\` or your full private key to your public repo.
- Use GitHub secrets for workflow tokens.

## Questions?
If you need workflow templates for agent orchestration, a Next.js template, or webhook handler examples, just ask!`,
      },

      // SYMBI Agent package.json
      {
        path: "symbi-agent/package.json",
        content: `{
  "name": "symbi-agent",
  "version": "1.0.0",
  "description": "GitHub App backend for symbi-agent automation",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "octokit": "^3.0.0",
    "body-parser": "^1.20.2"
  }
}`,
      },

      // GitHub Actions workflow
      {
        path: ".github/workflows/deploy.yml",
        content: `name: Deploy to Vercel

on:
  workflow_dispatch:
    inputs:
      agent_task:
        description: 'Agent orchestration task'
        required: false
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build Next.js
        run: npm run build
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token $VERCEL_TOKEN
      - name: Orchestrate Agents
        run: |
          echo "Task: \${{ github.event.inputs.agent_task }}"
          # Integrate SYMBI agent triggers here (Whisper, Claude, Pinecone)`,
      },

      // SYMBI Agent main file
      {
        path: "symbi-agent/index.js",
        content: `require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require('octokit');

const app = express();
app.use(bodyParser.json());

const octokit = new Octokit({
  auth: process.env.GITHUB_APP_PRIVATE_KEY
});

const REPO_OWNER = process.env.REPO_OWNER || 's8ken';
const REPO_NAME = process.env.REPO_NAME || 'symbi';

// Trigger workflow_dispatch for CI/CD deployment
app.post('/symbi/deploy', async (req, res) => {
  try {
    await octokit.rest.actions.createWorkflowDispatch({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: 'deploy.yml',
      ref: 'main',
      inputs: req.body.inputs || {}
    });
    res.json({ status: 'Deployment triggered' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Log symbolic state to repo
app.post('/symbi/log', async (req, res) => {
  try {
    const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
    const filePath = \`logs/symbolic-state-\${Date.now()}.json\`;
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: 'Log symbolic state',
      content,
      branch: 'main'
    });
    res.json({ status: \`Symbolic log pushed: \${filePath}\` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('SYMBI-Agent running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(\`symbi-agent listening on port \${PORT}\`));`,
      },

      // Environment example file
      {
        path: "symbi-agent/.env.example",
        content: `# GitHub App Configuration
GITHUB_APP_PRIVATE_KEY=your_private_key_here
GITHUB_APP_ID=your_app_id_here
REPO_OWNER=s8ken
REPO_NAME=symbi

# Server Configuration
PORT=4000

# Optional: Additional API Keys
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_claude_key_here
PINECONE_API_KEY=your_pinecone_key_here`,
      },
    ]

    console.log("Pushing SYMBI files to GitHub...")
    const result = await pushToGitHub(files, "🚀 Deploy SYMBI-Agent setup with collaboration workspace")

    console.log("✅ Successfully pushed all SYMBI files to GitHub!")
    return result
  } catch (error) {
    console.error("❌ Error pushing SYMBI files:", error)
    throw error
  }
}
