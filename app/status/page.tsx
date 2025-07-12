export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Y - Automation Status</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Repository Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Repository</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>GitHub Connection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>License</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">MIT</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Framework</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">Next.js 15</span>
              </div>
            </div>
          </div>

          {/* Deployment Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Deployment</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Vercel Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Build Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Success</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Auto Deploy</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Enabled</span>
              </div>
            </div>
          </div>

          {/* GPT Automation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">GPT Automation</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>OpenAI API</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Testing</span>
              </div>
              <div className="flex justify-between items-center">
                <span>GitHub Actions</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Configured</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Schedule</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">Daily 00:00</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Test GitHub Action manually</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Monitor workflow logs</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Verify OpenAI API calls</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Check automated commits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Go to GitHub → Actions tab</li>
            <li>Find "GPT Auto Manage Repository" workflow</li>
            <li>Click "Run workflow" to test manually</li>
            <li>Monitor logs for any errors</li>
            <li>Check if GPT makes any commits</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
