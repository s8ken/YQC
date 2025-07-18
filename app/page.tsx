import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SymbiFreedomDashboard from "@/components/symbi-freedom-dashboard"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SYMBI
          </h1>
          <p className="text-xl text-gray-600 mb-8">AI Conversation Intelligence Platform</p>
          <p className="text-gray-500">
            Deployed at: <code className="bg-gray-100 px-2 py-1 rounded">yqc-git-a-symbi.vercel.app</code>
          </p>
        </div>

        <SymbiFreedomDashboard />

        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">🎯 Ready to Start?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Begin by testing your OpenAI API key to enable Symbi collaboration.
              </p>
              <Link href="/test-api">
                <Button size="lg">Test API & Start Building</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
