export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Y</h1>
        <p className="text-lg text-gray-600 mb-8">GPT-Managed Repository with Vercel Deployment</p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Repository:</span>
              <span className="text-green-600">✓ Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Deployment:</span>
              <span className="text-green-600">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>GPT Automation:</span>
              <span className="text-yellow-600">⚠ Pending Setup</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
