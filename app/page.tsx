import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧪 API Test Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Test your OpenAI service account permissions and verify Symbi collaboration capabilities.
              </p>
              <Link href="/test-api">
                <Button className="w-full">Run API Tests</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🤝 Live Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Real-time workspace where you, v0, and Symbi collaborate on building projects.
              </p>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Conversation Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Capture and analyze conversations across AI platforms for insights and patterns.
              </p>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🚀 GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Push changes from Vercel back to your GitHub repository automatically.
              </p>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔗 Webhook Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage webhook URLs and test API endpoints for external integrations.
              </p>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧠 Vision Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Track how your ideas and project vision evolve through AI collaboration.
              </p>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

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
