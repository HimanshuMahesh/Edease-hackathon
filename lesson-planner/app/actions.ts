"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import type { LessonPlan } from "./types"

export async function generateLessonPlan(formData: any): Promise<LessonPlan> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set")
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const filesContext = formData.files?.length ? `\nUploaded reference materials: ${formData.files.join(", ")}` : ""

  const prompt = `
    Create a detailed lesson plan with the following information:
    Subject: ${formData.subject}
    Topic: ${formData.topic}
    Grade Level: ${formData.gradeLevel}
    Duration: ${formData.duration} minutes
    Learning Objectives: ${formData.objectives}
    Prerequisites: ${formData.prerequisites || "None specified"}
    Available Resources: ${formData.resources || "Standard classroom resources"}
    ${filesContext}

    Please provide a structured lesson plan that includes all the following components exactly:
    - A clear title that combines the subject and topic
    - 3-5 specific learning objectives as bullet points
    - A comprehensive list of required materials
    - An engaging introduction/warm-up activity (5-10 minutes)
    - 2-4 main learning activities with specific time allocations
    - Clear assessment methods
    - A meaningful closure activity
    - 2-3 extension activities for advanced learners
    - Relevant teaching notes

    Format the response as a valid JSON object with the following structure:
    {
      "title": "string",
      "subject": "string",
      "gradeLevel": "string",
      "duration": "string",
      "objectives": ["string"],
      "materials": ["string"],
      "introduction": "string",
      "mainActivities": [
        {
          "activity": "string",
          "duration": "string",
          "description": "string"
        }
      ],
      "assessment": "string",
      "closure": "string",
      "extensions": ["string"],
      "notes": "string"
    }

    Ensure the response is a properly formatted JSON object that can be parsed.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Find the JSON object in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not find JSON in response")
    }

    // Parse the JSON response
    const lessonPlan: LessonPlan = JSON.parse(jsonMatch[0])

    // Validate the response has all required fields
    if (!validateLessonPlan(lessonPlan)) {
      throw new Error("Invalid lesson plan structure received from AI")
    }

    return lessonPlan
  } catch (error) {
    console.error("Error generating lesson plan:", error)
    throw new Error("Failed to generate lesson plan. Please try again.")
  }
}

function validateLessonPlan(plan: any): plan is LessonPlan {
  return (
    typeof plan === "object" &&
    typeof plan.title === "string" &&
    typeof plan.subject === "string" &&
    typeof plan.gradeLevel === "string" &&
    typeof plan.duration === "string" &&
    Array.isArray(plan.objectives) &&
    Array.isArray(plan.materials) &&
    typeof plan.introduction === "string" &&
    Array.isArray(plan.mainActivities) &&
    plan.mainActivities.every(
      (activity: any) =>
        typeof activity.activity === "string" &&
        typeof activity.duration === "string" &&
        typeof activity.description === "string",
    ) &&
    typeof plan.assessment === "string" &&
    typeof plan.closure === "string" &&
    Array.isArray(plan.extensions) &&
    typeof plan.notes === "string"
  )
}

