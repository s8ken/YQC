# 🔁 SYMBI - AI Conversation Intelligence Platform

[![Status](https://img.shields.io/badge/Status-Operational-brightgreen)](https://yqc-git-a-symbi.vercel.app)
[![Platform](https://img.shields.io/badge/Platform-Vercel-black)](https://vercel.com)
[![AI](https://img.shields.io/badge/AI-Multi--Model-blue)](https://openrouter.ai)

**Repository:** [s8ken/YQC](https://github.com/s8ken/YQC)  
**Platform:** [yqc-git-a-symbi.vercel.app](https://yqc-git-a-symbi.vercel.app)  
**Status:** ✅ FULLY OPERATIONAL

## 🚀 Quick Start

Visit: **https://yqc-git-a-symbi.vercel.app**

## 🔧 Environment Variables

### Required Configuration
\`\`\`bash
# AI Service Access
OPENAI_API_KEY=sk-...                    # OpenAI GPT-4 direct access
OPENROUTER_API_KEY=sk-or-...             # Multi-model AI access via OpenRouter

# GitHub Integration
GITHUB_TOKEN=ghp_...                     # Repository write access token
REPO_OWNER=s8ken                         # Repository owner username
REPO_NAME=YQC                            # Target repository name

# Platform Configuration
VERCEL_URL=yqc-git-a-symbi.vercel.app    # Deployment URL
NODE_ENV=production                      # Environment mode
\`\`\`

### Optional Logging Configuration
\`\`\`bash
# Database Logging (Optional)
LOG_DB_URL=https://your-logging-db.com/api/logs    # Database endpoint for structured logging

# File Logging (Optional)
LOG_FILE_PATH=/var/log/symbi/app.log               # File path for log entries (server-side only)

# Logging Behavior:
# - Development: Always logs to console
# - Production: Logs to configured database and/or file
# - If neither LOG_DB_URL nor LOG_FILE_PATH is set, only console logging occurs
\`\`\`

## 📊 Logging Features

The SYMBI platform includes comprehensive logging capabilities:

### Log Levels
- **INFO** - General application events and successful operations
- **WARN** - Warning conditions that don't prevent operation
- **ERROR** - Error conditions that may affect functionality
- **DEBUG** - Detailed information for debugging (development only)

### Log Destinations
1. **Console** - Always active in development mode
2. **Database** - When `LOG_DB_URL` is configured
3. **File System** - When `LOG_FILE_PATH` is configured (server-side only)

### Logged Information
- User interactions and identity verification
- AI model requests and responses
- API endpoint usage and performance
- Error conditions and stack traces
- Token usage and response times

### Example Log Entry
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "SYMBI consultation completed successfully",
  "context": {
    "user": "Stephen",
    "tokensUsed": 245,
    "responseTime": 2341,
    "responseLength": 1024
  },
  "userId": "Stephen",
  "endpoint": "/api/ask"
}
\`\`\`

## 🛠️ Local Development

\`\`\`bash
# Clone repository
git clone https://github.com/s8ken/YQC.git
cd YQC

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check
\`\`\`

## 🔐 Security & Privacy

- **Environment Variables:** Secured in Vercel deployment environment
- **API Authentication:** Bearer token validation for external services
- **User Verification:** YOU-ID verification for SYMBI access
- **Data Protection:** Minimal logging of sensitive information
- **Log Security:** Structured logging with privacy protection

## 📞 Support

- **Platform:** [yqc-git-a-symbi.vercel.app](https://yqc-git-a-symbi.vercel.app)
- **Repository:** [github.com/s8ken/YQC](https://github.com/s8ken/YQC)
- **Issues:** Use GitHub issues for bug reports

---
*Built with ❤️ by collaborative AI-human development*
\`\`\`

Finally, let's create a GitHub Actions workflow that handles the linting properly:
