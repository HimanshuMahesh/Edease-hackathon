"use client"

import {
  type Clock,
  Users,
  ArrowRight,
  Github,
  Menu,
  X,
  Zap,
  Shield,
  BookOpen,
  BarChartIcon as ChartBar,
  Sparkles,
  Award,
  GraduationCap,
  Pencil,
  Calculator,
  Globe2,
  School,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import Link from "next/link"

interface FeatureCardProps {
  icon: typeof Clock
  title: string
  description: string
  href: string
}

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a
              href="#"
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 mr-2" />
                EdEase
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:bg-clip-text hover:text-transparent"
              >
                Features
              </a>
              <Button
                variant="outline"
                className="border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a
                href="#features"
                className="block text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:bg-clip-text hover:text-transparent"
              >
                Features
              </a>
              <Button
                variant="outline"
                className="w-full border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Grid Background */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-x-20 top-0 h-44 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 blur-3xl" />

              {/* Floating Education Icons */}
              <div className="absolute -left-16 top-1/4 animate-float-slow">
                <GraduationCap className="h-12 w-12 text-blue-500/40" />
              </div>
              <div className="absolute -right-8 top-1/3 animate-float-slow delay-200">
                <Pencil className="h-10 w-10 text-purple-500/40" />
              </div>
              <div className="absolute left-0 bottom-0 animate-float-slow delay-500">
                <Calculator className="h-8 w-8 text-blue-500/40" />
              </div>
              <div className="absolute right-4 -top-8 animate-float-slow delay-700">
                <Globe2 className="h-14 w-14 text-purple-500/40" />
              </div>
              <div className="absolute -left-8 -top-4 animate-float-slow delay-300">
                <BookOpen className="h-10 w-10 text-blue-500/40" />
              </div>
              <div className="absolute right-0 bottom-8 animate-float-slow delay-1000">
                <School className="h-12 w-12 text-purple-500/40" />
              </div>

              <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Transform Your Teaching
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Experience with EdEase
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-8 leading-relaxed">
              EdEase revolutionizes education management with intelligent automation, giving you more time to focus on
              what truly matters - teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:scale-105 hover:border-blue-500/20 hover:shadow-lg transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-20">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                  <ChartBar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Significant Time Savings
                </h2>
              </div>
              <p className="text-xl text-muted-foreground">Dramatically reduce administrative workload for educators</p>
            </Card>
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Trusted Services
                </h2>
              </div>
              <p className="text-xl text-muted-foreground">Proper Authentication and Security</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Features that transform teaching
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools designed to make education management effortless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
              icon={Users}
              title="Collaborative Task Manager"
              description="Unite your educational team with real-time collaboration tools and streamlined communication channels with notifications."
              href="https://edease-taskmanager.netlify.app/"
            />
            <FeatureCard
              icon={Zap}
              title="AI-Powered Schedule Generator"
              description="Generate optimal class schedules instantly with our advanced AI system that considers all constraints and preferences."
              href="https://edease-tt.netlify.app/"
            />
            <FeatureCard
              icon={BookOpen}
              title="Smart Lesson Planning"
              description="Create and export engaging lesson plans with AI assistance, ensuring diverse and effective learning experiences with an AI-powered smart assistant."
              href="https://ed-ease-lessonplan-gen.vercel.app/"
            />
            <FeatureCard
              icon={Shield}
              title="Smart Attendance Sysytem"
              description="Track attendance digitally with QR generation and gain valuable insights with comprehensive analytics and reporting."
              href="https://edease-attendace.netlify.app/"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-4">A Hackathon Project for Shikshalokam by Team Adyama</p>
          <p className="text-muted-foreground">Credits: Himanshu, Akash, Shrihari, Rahul</p>
        </div>
      </footer>
    </div>
  )
}

export function FeatureCard({ icon: Icon, title, description, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card className="relative p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-colors duration-300" />
        <div className="relative">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
            <Icon className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-300" />
          </div>
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </Card>
    </Link>
  )
}

