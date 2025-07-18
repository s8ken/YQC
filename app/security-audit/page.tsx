import DeepInfraSecurityAudit from "@/components/deepinfra-security-audit"

export default function SecurityAuditPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔒 Security Audit Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive security audit for DeepInfra API connection and potential unauthorized usage
          </p>
        </div>

        <DeepInfraSecurityAudit />
      </div>
    </div>
  )
}
