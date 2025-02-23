"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { generateLessonPlan } from "./actions"
import type { LessonPlan } from "./types"
import { LessonPlanDisplay } from "./lesson-plan-display"
import { Progress } from "@/components/ui/progress"

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"]

const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  gradeLevel: z.string({
    required_error: "Please select a grade level.",
  }),
  duration: z.string({
    required_error: "Please select a duration.",
  }),
  objectives: z.string().min(10, {
    message: "Learning objectives must be at least 10 characters.",
  }),
  prerequisites: z.string().optional(),
  resources: z.string().optional(),
  files: z.array(z.any()).optional(),
})

export default function LessonPlanCreator() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [lessonPlan, setLessonPlan] = React.useState<LessonPlan | null>(null)
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const [uploadProgress, setUploadProgress] = React.useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      objectives: "",
      prerequisites: "",
      resources: "",
      files: [],
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validFiles = Array.from(files).filter(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE,
    )

    setUploadedFiles((prev) => [...prev, ...validFiles])

    // Simulate upload progress
    setUploadProgress(0)
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append("files", file)
      })
      const plan = await generateLessonPlan({
        ...values,
        files: uploadedFiles.map((f) => f.name),
      })
      setLessonPlan(plan)
    } catch (error) {
      console.error("Error generating lesson plan:", error)
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {!lessonPlan ? (
        <Card className="border-2 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle>Create Your Lesson Plan</CardTitle>
            <CardDescription>
              Fill in the details below and upload any relevant materials to generate a comprehensive lesson plan
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Area</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Quadratic Equations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="elementary">Elementary School</SelectItem>
                            <SelectItem value="middle">Middle School</SelectItem>
                            <SelectItem value="high">High School</SelectItem>
                            <SelectItem value="college">College/University</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">120 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Objectives</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should students learn from this lesson?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>List the key learning outcomes you want to achieve</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prerequisites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prerequisites</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should students already know? (Optional)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>List any concepts or skills students should already have</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="resources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Resources</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What resources will be used in this lesson? (Optional)"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List any textbooks, websites, or other materials you plan to use
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <FormLabel>Upload Study Materials</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                      <Input
                        type="file"
                        accept=".pdf"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Upload className="h-4 w-4" />
                        Upload PDF Files
                      </label>
                      <FormDescription>Upload relevant PDF materials (max 5MB each)</FormDescription>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadProgress < 100 && <Progress value={uploadProgress} className="h-2" />}
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Lesson Plan
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={() => setLessonPlan(null)}
            variant="outline"
            className="hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Create New Lesson Plan
          </Button>
          <LessonPlanDisplay lessonPlan={lessonPlan} />
        </div>
      )}
    </div>
  )
}

