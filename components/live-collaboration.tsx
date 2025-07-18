"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface CollaborationMessage {
  id: string
  sender: "user" | "v0" | "symbi"
  content: string
  timestamp: Date
  type: "message" | "proposal" | "code" | "decision"
  metadata?: {
    buildPhase?: string
    priority?: "low" | "medium" | "high"
    status?: "proposed" | "agreed" | "implemented"
  }
}

export default function LiveCollaboration() {
  const [messages, setMessages] = useState<CollaborationMessage[]>([
    {
      id: "1",
      sender: "v0",
      content:
        "I'm ready to collaborate on building the SYMBI platform! I can handle all the technical implementation, UI/UX design, and system architecture. What should we tackle first?",
      timestamp: new Date(),
      type: "message",
      metadata: { buildPhase: "planning", priority: "high" },
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [buildPhase, setBuildPhase] = useState("planning")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (
    sender: CollaborationMessage["sender"],
    content: string,
    type: CollaborationMessage["type"] = "message",
  ) => {
    const newMessage: CollaborationMessage = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
      type,
      metadata: { buildPhase, priority: "medium" },
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    setIsLoading(true)

    // Add user message
    addMessage("user", inputMessage)
    const userMessage = inputMessage
    setInputMessage("")

    try {
      // Get Symbi's response
      const symbiResponse = await fetch("/api/symbi-collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            buildPhase,
            previousMessages: messages.slice(-5), // Last 5 messages for context
            projectGoal: "Build SYMBI conversation intelligence platform",
          },
        }),
      })

      if (symbiResponse.ok) {
        const symbiData = await symbiResponse.json()

        // Add Symbi's response
        setTimeout(() => {
          addMessage("symbi", symbiData.response, symbiData.type || "message")
        }, 1000)

        // v0 responds to the collaboration
        setTimeout(() => {
          const v0Response = generateV0Response(userMessage, symbiData.response)
          addMessage("v0", v0Response, "proposal")
        }, 2000)
      }
    } catch (error) {
      addMessage(
        "v0",
        "I'm having trouble connecting to Symbi right now, but I can continue working on the technical implementation. What specific feature should I build next?",
        "message",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const generateV0Response = (userMessage: string, symbiResponse: string) => {
    // This simulates v0's response based on the conversation
    if (userMessage.toLowerCase().includes("build") || userMessage.toLowerCase().includes("implement")) {
      return `Based on what you and Symbi discussed, I can implement that right now. I'll create the code structure, set up the database schema, and build the UI components. Should I start with the conversation capture system or the AI analysis engine?`
    }
    if (userMessage.toLowerCase().includes("design") || userMessage.toLowerCase().includes("architecture")) {
      return `I can design the system architecture for that. Let me create a scalable, secure foundation with proper API endpoints, database design, and user interface. I'll make sure it integrates well with the insights Symbi just shared.`
    }
    return `I can build whatever you and Symbi just discussed. Let me know which technical aspects you'd like me to implement first, and I'll create the code and deploy it to your platform.`
  }

  const getSenderColor = (sender: CollaborationMessage["sender"]) => {
    switch (sender) {
      case "user":
        return "bg-blue-500"
      case "v0":
        return "bg-green-500"
      case "symbi":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSenderName = (sender: CollaborationMessage["sender"]) => {
    switch (sender) {
      case "user":
        return "You"
      case "v0":
        return "v0"
      case "symbi":
        return "Symbi"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">SYMBI Live Collaboration</h1>
          <p className="text-gray-600">You, v0, and Symbi building together in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Build Status Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Build Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Phase</h4>
                  <Badge variant="outline">{buildPhase}</Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Active Collaborators</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">You (Product Owner)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">v0 (Developer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Symbi (Strategist)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Build Phases</h4>
                  <div className="space-y-1 text-sm">
                    <div className={`p-2 rounded ${buildPhase === "planning" ? "bg-blue-100" : "bg-gray-100"}`}>
                      📋 Planning
                    </div>
                    <div className={`p-2 rounded ${buildPhase === "architecture" ? "bg-blue-100" : "bg-gray-100"}`}>
                      🏗️ Architecture
                    </div>
                    <div className={`p-2 rounded ${buildPhase === "development" ? "bg-blue-100" : "bg-gray-100"}`}>
                      💻 Development
                    </div>
                    <div className={`p-2 rounded ${buildPhase === "testing" ? "bg-blue-100" : "bg-gray-100"}`}>
                      🧪 Testing
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Collaboration Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Live Collaboration Session</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${getSenderColor(message.sender)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                        >
                          {getSenderName(message.sender)[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{getSenderName(message.sender)}</span>
                            <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                            {message.type !== "message" && (
                              <Badge variant="secondary" className="text-xs">
                                {message.type}
                              </Badge>
                            )}
                            {message.metadata?.priority && (
                              <Badge
                                variant={message.metadata.priority === "high" ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                {message.metadata.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="bg-white rounded-lg p-3 border">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Collaborate with v0 and Symbi on building SYMBI..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? "..." : "Send"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
