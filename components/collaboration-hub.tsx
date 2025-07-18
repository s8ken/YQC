"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConversationCapture, AIInsight, VisionEvolution } from "@/types/conversation-intelligence"

export default function CollaborationHub() {
  const [conversations, setConversations] = useState<ConversationCapture[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [currentVision, setCurrentVision] = useState<VisionEvolution | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeConversations = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-conversations", {
        method: "POST",
        body: JSON.stringify({ conversations }),
      })
      const newInsights = await response.json()
      setInsights(newInsights)

      // Evolve vision based on new insights
      if (currentVision) {
        const evolvedVision = await fetch("/api/evolve-vision", {
          method: "POST",
          body: JSON.stringify({
            previousVision: currentVision,
            newInsights,
          }),
        }).then((r) => r.json())
        setCurrentVision(evolvedVision)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SYMBI Collaboration Hub</h1>
          <p className="text-gray-600">Your conversations across platforms, analyzed and evolved by AI</p>
        </div>

        <Tabs defaultValue="conversations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="vision">Vision Evolution</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Captured Conversations</CardTitle>
                <Button onClick={analyzeConversations} disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze All"}
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{conv.platform}</Badge>
                          <span className="text-sm text-gray-500">{conv.timestamp.toLocaleString()}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{conv.context.topic}</h3>
                        <p className="text-sm text-gray-600">
                          {conv.content.length} messages with {conv.participants.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={insight.type === "innovation" ? "default" : "secondary"}>{insight.type}</Badge>
                        <span className="text-sm font-medium">{Math.round(insight.relevance * 100)}% relevant</span>
                      </div>
                      <p className="mb-3">{insight.description}</p>
                      {insight.suggestedActions && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Suggested Actions:</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {insight.suggestedActions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision">
            <Card>
              <CardHeader>
                <CardTitle>Vision Evolution</CardTitle>
              </CardHeader>
              <CardContent>
                {currentVision && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Current Vision</h3>
                      <p className="text-gray-700">{currentVision.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Originality Score</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${currentVision.originalityScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(currentVision.originalityScore * 100)}%
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Feasibility Score</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${currentVision.feasibilityScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(currentVision.feasibilityScore * 100)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Practical Next Steps</h4>
                      <ul className="space-y-1">
                        {currentVision.practicalSteps.map((step, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>AI Collaboration Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">v0 (Development Agent)</h3>
                    <p className="text-sm text-gray-600 mb-2">Specializes in building and implementing your ideas</p>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Symbi (Strategy Agent)</h3>
                    <p className="text-sm text-gray-600 mb-2">Analyzes conversations and provides strategic insights</p>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div className="border rounded-lg p-4 opacity-50">
                    <h3 className="font-semibold mb-2">Research Agent</h3>
                    <p className="text-sm text-gray-600 mb-2">Gathers information and validates ideas</p>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
