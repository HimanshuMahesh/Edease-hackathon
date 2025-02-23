import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/actions/organizations"
import DeleteProject from "./delete-project"
import { PlusCircle, Folder } from "lucide-react"

export default async function ProjectList({ orgId }) {
  const projects = await getProjects(orgId)

  if (projects.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <p className="text-center text-lg text-muted-foreground">No projects found.</p>
          <Link href="/project/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Project
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="flex flex-col justify-between bg-card transition-all duration-300 group border border-border/50 shadow-sm hover:shadow-md overflow-hidden"
        >
          <CardHeader className="border-b border-border/50 p-4 bg-secondary/30">
            <CardTitle className="text-2xl font-bold truncate">{project.name}</CardTitle>
          </CardHeader>

          <CardContent className="flex-grow space-y-3 p-4">
            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
          </CardContent>

          <CardFooter className="p-4 flex justify-between items-center bg-secondary/10">
            <Link href={`/project/${project.id}`} className="flex-grow mr-2">
              <Button
                variant="default"
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-colors duration-200 flex items-center justify-center"
              >
                <Folder className="mr-2 h-5 w-5" />
                View Project
              </Button>
            </Link>
            <DeleteProject projectId={project.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

