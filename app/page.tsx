import CollaborationWorkspace from "@/components/collaboration-workspace"
import SymbiDeployer from "@/components/symbi-deployer"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <SymbiDeployer />
        </div>
        <CollaborationWorkspace />
      </div>
    </div>
  )
}
