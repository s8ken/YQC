export interface Message {
  id: string
  sender: "user" | "v0" | "symbi"
  content: string
  timestamp: Date
  type: "message" | "code" | "task" | "decision"
  metadata?: {
    projectContext?: string
    codeChanges?: string[]
    taskStatus?: "pending" | "in-progress" | "completed"
  }
}

export interface ProjectState {
  id: string
  name: string
  currentPhase: string
  decisions: Decision[]
  codebase: any // CodebaseSnapshot is undeclared, replaced with any for now
  tasks: Task[]
}

export interface Decision {
  id: string
  description: string
  decidedBy: "user" | "v0" | "symbi"
  timestamp: Date
  impact: string
}

export interface Task {
  id: string
  description: string
  assignedTo: "user" | "v0" | "symbi"
  status: "pending" | "in-progress" | "completed"
  dependencies: string[]
}
