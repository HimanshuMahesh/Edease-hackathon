import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer } from "lucide-react"
import type { LessonPlan } from "./types"

interface LessonPlanDisplayProps {
  lessonPlan: LessonPlan
}

export function LessonPlanDisplay({ lessonPlan }: LessonPlanDisplayProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(lessonPlan, null, 2)], {
      type: "application/json",
    })
    element.href = URL.createObjectURL(file)
    element.download = `${lessonPlan.title.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold">Your Lesson Plan</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="text-2xl">{lessonPlan.title}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Subject:</span>
              {lessonPlan.subject}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Grade Level:</span>
              {lessonPlan.gradeLevel}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Duration:</span>
              {lessonPlan.duration}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Learning Objectives</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="list-disc pl-6 space-y-2">
                  {lessonPlan.objectives.map((objective, i) => (
                    <li key={i} className="text-muted-foreground">
                      {objective}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Materials Needed</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="list-disc pl-6 space-y-2">
                  {lessonPlan.materials.map((material, i) => (
                    <li key={i} className="text-muted-foreground">
                      {material}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Introduction</h3>
            <Card>
              <CardContent className="p-4 text-muted-foreground">{lessonPlan.introduction}</CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Main Activities</h3>
            <div className="grid gap-4">
              {lessonPlan.mainActivities.map((activity, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{activity.activity}</h4>
                      <span className="text-sm px-2 py-1 bg-muted rounded-md">{activity.duration}</span>
                    </div>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Assessment</h3>
            <Card>
              <CardContent className="p-4 text-muted-foreground">{lessonPlan.assessment}</CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Closure</h3>
            <Card>
              <CardContent className="p-4 text-muted-foreground">{lessonPlan.closure}</CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Extensions & Enrichment</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="list-disc pl-6 space-y-2">
                  {lessonPlan.extensions.map((extension, i) => (
                    <li key={i} className="text-muted-foreground">
                      {extension}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {lessonPlan.notes && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <Card>
                <CardContent className="p-4 text-muted-foreground">{lessonPlan.notes}</CardContent>
              </Card>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

