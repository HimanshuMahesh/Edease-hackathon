export interface LessonPlan {
  title: string
  subject: string
  gradeLevel: string
  duration: string
  objectives: string[]
  materials: string[]
  introduction: string
  mainActivities: {
    activity: string
    duration: string
    description: string
  }[]
  assessment: string
  closure: string
  extensions: string[]
  notes: string
}

