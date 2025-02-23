import Link from "next/link"
import { getProject } from "@/actions/projects"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import SprintCreationForm from "../_components/create-sprint"
import SprintBoard from "../_components/sprint-board"

export default async function ProjectPage({ params }) {
  const { projectId } = params
  const project = await getProject(projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Link href={`/organization/${project.organizationId}`}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Organization
          </Button>
        </Link>
      </div>

      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints.length > 0 ? (
        <SprintBoard sprints={project.sprints} projectId={projectId} orgId={project.organizationId} />
      ) : (
        <div className="mt-8 p-4 bg-secondary/10 rounded-md text-center">
          <p className="text-lg text-muted-foreground">No sprints yet. Create a Sprint using the form above.</p>
        </div>
      )}
    </div>
  )
}

