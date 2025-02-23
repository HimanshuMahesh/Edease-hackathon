import LessonPlanCreator from "./lesson-plan-creator"
import { GraduationCap, Sparkles } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 -z-10 transform">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
              </div>

              {/* Logo and Title */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <GraduationCap className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                  <Sparkles className="absolute -right-4 -top-2 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      Ed
                    </span>
                    <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      Ease
                    </span>
                  </h1>
                  <p className="text-2xl md:text-3xl font-medium text-muted-foreground">AI-Powered Lesson Planning</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Transform your teaching preparation with our intelligent lesson plan generator. Upload your materials,
                specify your needs, and get comprehensive lesson plans in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Customizable Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>PDF Resource Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>AI-Powered Insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative">
            {/* Background gradient for form section */}
            <div className="absolute inset-0 -z-10 transform">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-transparent via-blue-50/50 dark:via-blue-900/10 to-transparent" />
            </div>
            <LessonPlanCreator />
          </div>
        </div>
      </main>
    </div>
  )
}

