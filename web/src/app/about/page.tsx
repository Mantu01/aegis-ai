"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Globe, Lock, Brain, Heart, Sparkles, TrendingUp, CheckCircle } from "lucide-react"
import { Github, Linkedin, Twitter, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

const teamMembers = [
  {
    name: "Alex Morgan",
    role: "Founder & CEO",
    description: "Former cybersecurity expert at Google, 10+ years in child safety tech",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Lead",
    description: "PhD in Machine Learning, specializing in content moderation algorithms",
    icon: Brain,
    color: "bg-green-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Director",
    description: "Previously led parenting apps with 5M+ users",
    icon: Users,
    color: "bg-red-500",
  },
  {
    name: "Priya Sharma",
    role: "Child Psychologist",
    description: "Expert in digital wellness and child development",
    icon: Heart,
    color: "bg-green-500",
  },
]

const features = [
  {
    title: "Real-time AI Monitoring",
    description: "Advanced machine learning models analyze content 24/7",
    icon: Sparkles,
  },
  {
    title: "Multi-Platform Protection",
    description: "Works across websites, apps, and social media",
    icon: Globe,
  },
  {
    title: "Privacy First",
    description: "End-to-end encryption for all monitored data",
    icon: Lock,
  },
  {
    title: "Smart Alerts",
    description: "Intelligent notifications for parents about potential risks",
    icon: TrendingUp,
  },
]

const milestones = [
  { year: "2021", event: "Aegis AI founded with vision of safer internet for children" },
  { year: "2022", event: "First AI models deployed, protected 10,000+ devices" },
  { year: "2023", event: "Partnerships with educational institutions established" },
  { year: "2024", event: "Expanded to international markets, 100,000+ families protected" },
]

export default function AboutPage() {
  const handleContact = () => {
    toast.success("Contact form opened!")
  }

  const handleSocialClick = (platform: string) => {
    toast.info(`Redirecting to ${platform}`)
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-red-50 dark:bg-red-900/20">
          <ShieldCheck className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Protecting Childhood in the Digital Age</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Aegis AI uses cutting-edge artificial intelligence to create a safer online environment for children worldwide.
        </p>
      </div>

      <div className="grid gap-6 mb-10 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We believe every child deserves a safe digital playground. Aegis AI was born from a simple vision: 
              to empower parents with intelligent tools that protect without invading privacy.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Real-time content analysis using advanced NLP</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Context-aware risk scoring algorithms</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Privacy-focused monitoring architecture</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-green-500" />
              Our Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Powered by proprietary AI models trained on millions of data points, our system understands context 
              and nuance better than traditional filters.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-500 hover:bg-red-600">Deep Learning</Badge>
              <Badge className="bg-green-500 hover:bg-green-600">Natural Language Processing</Badge>
              <Badge className="bg-red-500 hover:bg-red-600">Computer Vision</Badge>
              <Badge className="bg-green-500 hover:bg-green-600">Behavioral Analysis</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-bold text-center mb-6">Our Team</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardHeader>
                <div className={`${member.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <member.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-red-500 dark:text-red-400 font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-bold text-center mb-6">Why Choose Aegis AI</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-red-500" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 mb-10 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Journey</CardTitle>
            <CardDescription>Milestones in child protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-0.5 h-full bg-linear-to-b from-red-500 to-green-500"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="font-bold text-red-500">{milestone.year}</div>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join Our Mission</CardTitle>
            <CardDescription>Connect with us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We're always looking for passionate individuals and organizations to collaborate with. 
                Together, we can build a safer internet for future generations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSocialClick("GitHub")}
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSocialClick("LinkedIn")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSocialClick("Twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSocialClick("Email")}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleContact} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Contact Our Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center p-2 mb-3 rounded-full bg-red-100 dark:bg-red-800">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">100,000+ Families Protected</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of parents who trust Aegis AI to protect their children online
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline">Read Case Studies</Button>
              <Button className="bg-red-500 hover:bg-red-600">Start Free Trial</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}