import YQCConnectionTester from "@/components/yqc-connection-tester"

export default function YQCTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🔗 YQC Repository Integration</h1>
          <p className="text-gray-600">Test and verify connection to your newly public YQC repository</p>
        </div>

        <YQCConnectionTester />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Repository URL:{" "}
            <a
              href="https://github.com/s8ken/YQC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github.com/s8ken/YQC
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
