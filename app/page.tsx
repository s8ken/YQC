import CollaborationWorkspace from "@/components/collaboration-workspace"
import SymbiDeployer from "@/components/symbi-deployer"
import WebhookManager from "@/components/webhook-manager"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-8">
        <SymbiDeployer />
        <WebhookManager />
        <CollaborationWorkspace />
      </div>
    </div>
  )
}
