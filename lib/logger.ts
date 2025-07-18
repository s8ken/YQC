interface LogEntry {
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  context?: Record<string, any>
  userId?: string
  endpoint?: string
}

class Logger {
  private static instance: Logger
  private logDbUrl?: string
  private logFilePath?: string

  constructor() {
    this.logDbUrl = process.env.LOG_DB_URL
    this.logFilePath = process.env.LOG_FILE_PATH
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private async writeToDatabase(entry: LogEntry): Promise<void> {
    if (!this.logDbUrl) return

    try {
      // Database logging implementation
      await fetch(this.logDbUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error("Failed to write to database log:", error)
    }
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.logFilePath || typeof window !== "undefined") return

    try {
      const fs = await import("fs/promises")
      const logLine = `${entry.timestamp.toISOString()} [${entry.level.toUpperCase()}] ${entry.message} ${entry.context ? JSON.stringify(entry.context) : ""}\n`

      await fs.appendFile(this.logFilePath, logLine)
    } catch (error) {
      console.error("Failed to write to file log:", error)
    }
  }

  async log(
    level: LogEntry["level"],
    message: string,
    context?: Record<string, any>,
    userId?: string,
    endpoint?: string,
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
      endpoint,
    }

    // Always log to console in development
    if (process.env.NODE_ENV === "development") {
      const contextStr = context ? ` ${JSON.stringify(context)}` : ""
      const userStr = userId ? ` [User: ${userId}]` : ""
      const endpointStr = endpoint ? ` [${endpoint}]` : ""
      console.log(`[${level.toUpperCase()}]${userStr}${endpointStr} ${message}${contextStr}`)
    }

    // Write to configured destinations
    await Promise.allSettled([this.writeToDatabase(entry), this.writeToFile(entry)])
  }

  async info(message: string, context?: Record<string, any>, userId?: string, endpoint?: string): Promise<void> {
    await this.log("info", message, context, userId, endpoint)
  }

  async warn(message: string, context?: Record<string, any>, userId?: string, endpoint?: string): Promise<void> {
    await this.log("warn", message, context, userId, endpoint)
  }

  async error(message: string, context?: Record<string, any>, userId?: string, endpoint?: string): Promise<void> {
    await this.log("error", message, context, userId, endpoint)
  }

  async debug(message: string, context?: Record<string, any>, userId?: string, endpoint?: string): Promise<void> {
    await this.log("debug", message, context, userId, endpoint)
  }
}

export const logger = Logger.getInstance()
