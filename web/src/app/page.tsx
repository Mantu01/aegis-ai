import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, BarChart, AlertTriangle, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 px-4 py-1 mb-4">
            <Shield className="w-4 h-4 mr-2" />
            AI-Powered Child Protection
          </Badge>
          
          <h1 className="text-5xl font-bold tracking-tight">
            Aegis <span className="text-green-600">AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Advanced protection against harmful online content. Keep your children safe in the digital world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
              <Lock className="mr-2" />
              Generate Parent Token
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-red-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>AI scans content instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Advanced algorithms detect and block harmful content before it reaches your child.</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive usage insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track browsing patterns and receive detailed reports on your child's online activity.</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Instant Alerts</CardTitle>
              <CardDescription>Proactive threat detection</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Get immediate notifications when potential threats are detected in your child's online activity.</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by Parents Worldwide</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of families who trust Aegis AI to protect their children online
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">10K+</div>
                <div className="text-sm text-muted-foreground">Protected Children</div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600">99.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-muted-foreground">AI Monitoring</div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600">50M+</div>
                <div className="text-sm text-muted-foreground">Threats Blocked</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to Secure Your Child's Digital World?</h3>
                <p className="text-muted-foreground">Start with a free token generation</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg whitespace-nowrap">
                <Shield className="mr-2" />
                Get Started Free
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}