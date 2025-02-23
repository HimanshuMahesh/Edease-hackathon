import React from "react"
import Link from "next/link"
import { ChevronRight, Layout, Calendar, BarChart, ArrowRight, Users, Zap, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is EdEase?",
    answer:
      "EdEase is a specialized task management tool designed specifically for teachers to streamline their daily responsibilities, lesson planning, and student assessments. It helps educators stay organized and focused on what matters most - teaching.",
  },
  {
    question: "How does EdEase help teachers save time?",
    answer:
      "EdEase combines intuitive lesson planning tools, grade tracking, and task management features in one platform. It automates routine tasks, provides ready-to-use templates, and helps teachers organize their work more efficiently, saving valuable time in their busy schedules.",
  },
  {
    question: "Is EdEase suitable for all grade levels?",
    answer:
      "Yes, EdEase is designed to be versatile and adaptable for teachers across all grade levels, from elementary to high school. The platform can be customized to match different teaching styles and curriculum requirements.",
  },
  {
    question: "What key features does EdEase offer?",
    answer:
      "EdEase provides essential features including lesson plan management, assignment tracking, grade book integration, student progress monitoring, curriculum planning tools, and communication features for parent-teacher interaction. All these tools are designed to make teachers' lives easier.",
  },
  {
    question: "Can EdEase handle multiple classes?",
    answer:
      "Absolutely! EdEase is built to manage multiple classes simultaneously. Teachers can easily switch between different classes, track assignments for each group, and maintain separate gradebooks while keeping everything organized in one place.",
  },
  {
    question: "How easy is it to get started with EdEase?",
    answer:
      "EdEase is designed with teachers in mind, featuring an intuitive interface and helpful tutorials. New users can import their existing class lists and start organizing their tasks immediately. We also provide comprehensive support and resources to ensure a smooth transition.",
  },
]

const features = [
  {
    title: "Smart Lesson Planning",
    description: "Create and organize lesson plans efficiently with our intuitive planning tools and templates.",
    icon: Layout,
  },
  {
    title: "Assignment Calendar",
    description: "Keep track of assignments, due dates, and important academic events in one unified calendar.",
    icon: Calendar,
  },
  {
    title: "Progress Tracking",
    description: "Monitor student progress and generate comprehensive performance reports with ease.",
    icon: BarChart,
  },
  {
    title: "Class Management",
    description: "Manage multiple classes, student groups, and individual learning paths effectively.",
    icon: Users,
  },
  {
    title: "Task Automation",
    description: "Automate routine tasks like attendance tracking and grade calculations to save time.",
    icon: Zap,
  },
  {
    title: "Curriculum Planning",
    description: "Plan and organize your curriculum with our comprehensive educational tools.",
    icon: GraduationCap,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen animated-dotted-background">
      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-extrabold gradient-title pb-6 flex flex-col">
          Teach Smarter <br />
          <span className="text-7xl sm:text-8xl lg:text-9xl mt-4">with EdEase</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          The ultimate task management solution designed specifically for educators.
        </p>
        <p className="text-xl mb-12 max-w-2xl mx-auto"></p>
        <Link href="/onboarding">
          <Button size="lg" className="mr-4 button-hover">
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <Link href="https://github.com/himanshumahesh">
          <Button size="lg" variant="outline" className="button-hover">
            Github
          </Button>
        </Link>
      </section>

      <section id="features" className="py-20 px-8 md:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-none shadow-lg card-hover">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 mb-6 text-blue-400" />
                  <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-5">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-800/50 rounded-lg overflow-hidden faq-item"
              >
                <AccordionTrigger className="px-6 py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-gray-750/50">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Teaching Experience?</h3>
          <p className="text-xl mb-12">
            Join thousands of educators already using EdEase to streamline their teaching workflow and focus on what matters most.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="animate-bounce button-hover">
              Start For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}