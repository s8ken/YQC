import type { LogEntry } from "./types" // Assuming LogEntry is defined in a separate file

class Logger {
  private static instance: Logger
  private logDbUrl?: string
  private logFilePath?: string

  constructor() {
    // These are OPTIONAL - if not set, logging still works
    this.logDbUrl = process.env.LOG_DB_URL // undefined = no database logging
    this.logFilePath = process.env.LOG_FILE_PATH // undefined = no file logging
  }

  async log(level: LogEntry["level"], message: string, context?: Record<string, any>): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    }

    // ✅ THIS ALWAYS WORKS - Console logging in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[${level.toUpperCase()}] ${message}`, context || "")
    }

    // ⚠️ THESE ARE OPTIONAL - Only run if configured
    if (this.logDbUrl) {
      await this.writeToDatabase(entry) // Only if LOG_DB_URL is set
    }

    if (this.logFilePath) {
      await this.writeToFile(entry) // Only if LOG_FILE_PATH is set
    }
  }

  private async writeToDatabase(entry: LogEntry): Promise<void> {
    if (!this.logDbUrl) return // Gracefully skip if not configured

    try {
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
    if (!this.logFilePath || typeof window !== "undefined") return // Skip if not configured or in browser

    try {
      const fs = await import("fs/promises")
      const logLine = `${entry.timestamp.toISOString()} [${entry.level.toUpperCase()}] ${entry.message}\n`
      await fs.appendFile(this.logFilePath, logLine)
    } catch (error) {
      console.error("Failed to write to file log:", error)
    }
  }
}
