# 🔁 SYMBI - AI Conversation Intelligence Platform

## 🔧 Environment Variables

### ✅ Required Configuration
\`\`\`bash
# AI Service Access (REQUIRED)
OPENAI_API_KEY=sk-...                    # OpenAI GPT-4 direct access
OPENROUTER_API_KEY=sk-or-...             # Multi-model AI access via OpenRouter

# GitHub Integration (REQUIRED)
GITHUB_TOKEN=ghp_...                     # Repository write access token
REPO_OWNER=s8ken                         # Repository owner username  
REPO_NAME=YQC                            # Target repository name

# Platform Configuration (REQUIRED)
VERCEL_URL=yqc-git-a-symbi.vercel.app    # Deployment URL
NODE_ENV=production                      # Environment mode
\`\`\`

### 🔄 Optional Advanced Logging (NOT REQUIRED)
\`\`\`bash
# Database Logging (Optional - for advanced users)
LOG_DB_URL=https://your-logging-db.com/api/logs    # Database endpoint for structured logging

# File Logging (Optional - for server deployments)
LOG_FILE_PATH=/var/log/symbi/app.log               # File path for log entries

# 📝 NOTE: If these are not set, logging still works perfectly!
# - Development: Logs to console (always works)
# - Production: Logs to console + optional destinations above
\`\`\`

## 📊 Current Logging Behavior

**Without LOG_DB_URL or LOG_FILE_PATH (your current setup):**
- ✅ Console logging in development (works perfectly)
- ✅ Basic logging in production (works perfectly)
- ✅ All SYMBI interactions are tracked
- ✅ Error handling and debugging information available

**With optional logging configured:**
- ✅ Everything above PLUS
- 📊 Structured database storage for analytics
- 📁 File-based logs for server monitoring
- 🔍 Advanced log querying and analysis

## 🎯 Recommendation: Start Simple

**For now, don't add LOG_DB_URL or LOG_FILE_PATH.** 

Your current setup is perfect and logs everything you need to:
- Console in development
- Vercel logs in production
- All SYMBI interactions tracked
- Error debugging available

**Later, if you want advanced logging:**
- Add Supabase for LOG_DB_URL (structured log storage)
- Add file logging for LOG_FILE_PATH (server monitoring)
\`\`\`
