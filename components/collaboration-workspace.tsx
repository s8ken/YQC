"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Message, ProjectState } from "@/types/collaboration"
import { V0Connector, SymbiConnector } from "@/lib/ai-connectors"

export default function CollaborationWorkspace() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projectState, setProjectState] = useState<ProjectState>({
    id: "symbi-project",
    name: "Symbi Collaboration Platform",
    currentPhase: "Initial Setup",
    decisions: [],
    codebase: {} as any,
    tasks: [],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const v0Connector = new V0Connector()
  const symbiConnector = new SymbiConnector()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (sender: Message["sender"], content: string, type: Message["type"] = "message") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
      type,
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
      // Get responses from both AIs
      const [v0Response, symbiResponse] = await Promise.all([
        v0Connector.sendMessage(userMessage, projectState),
        symbiConnector.sendMessage(userMessage, projectState),
      ])

      // Add AI responses
      setTimeout(() => addMessage("v0", v0Response), 500)
      setTimeout(() => addMessage("symbi", symbiResponse), 1000)

      // Allow AIs to respond to each other
      setTimeout(async () => {
        const aiToAiMessage = `v0 said: "${v0Response}". What are your thoughts on this approach?`
        const symbiReply = await symbiConnector.sendMessage(aiToAiMessage, projectState)
        addMessage("symbi", symbiReply)
      }, 2000)
    } catch (error) {
      addMessage("user", "Error: Failed to get AI responses", "message")
    } finally {
      setIsLoading(false)
    }
  }

  const getSenderColor = (sender: Message["sender"]) => {
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

  const getSenderName = (sender: Message["sender"]) => {
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
    <div className="flex h-screen bg-gray-50">
      {/* Project State Sidebar */}
      <div className="w-80 bg-white border-r p-4">
        <Card>
          <CardHeader>
            <CardTitle>Project State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Current Phase</h4>
              <Badge variant="outline">{projectState.currentPhase}</Badge>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold">Active Participants</h4>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-blue-500">You</Badge>
                <Badge className="bg-green-500">v0</Badge>
                <Badge className="bg-purple-500">Symbi</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold">Recent Decisions</h4>
              <div className="text-sm text-gray-600 mt-2">
                {projectState.decisions.length === 0
                  ? "No decisions made yet"
                  : projectState.decisions.slice(-3).map((decision) => (
                      <div key={decision.id} className="mb-2">
                        <div className="font-medium">{decision.description}</div>
                        <div className="text-xs">by {decision.decidedBy}</div>
                      </div>
                    ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4">
          <h1 className="text-xl font-bold">AI Collaboration Workspace</h1>
          <p className="text-gray-600">You, v0, and Symbi working together on the project</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${getSenderColor(message.sender)} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {getSenderName(message.sender)[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{getSenderName(message.sender)}</span>
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    {message.type !== "message" && (
                      <Badge variant="secondary" className="text-xs">
                        {message.type}
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

        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message to the team..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
