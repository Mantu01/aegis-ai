"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, AlertTriangle, CheckCircle, Clock, Smartphone, Wifi, Battery, Calendar, User } from "lucide-react"
import { deviceAPI, DeviceDetail } from "@/lib/api"
import { toast } from "sonner"

export default function DeviceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [deviceData, setDeviceData] = useState<DeviceDetail | null>(null)

  const deviceId = params.id as string

  useEffect(() => {
    const fetchDeviceData = async () => {
      setIsLoading(true)
      try {
        const data = await deviceAPI.getDetails(deviceId)
        setDeviceData(data)
      } catch (error: any) {
        console.error("Error fetching device data:", error)
        toast.error(error.response?.data?.message || "Failed to load device details")
        if (error.response?.status === 404) {
          router.push("/dashboard")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (deviceId) {
      fetchDeviceData()
    }
  }, [deviceId, router])

  const getRiskColor = (score: number) => {
    if (score <= 10) return "bg-green-500"
    if (score <= 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRiskLabel = (score: number) => {
    if (score <= 10) return "Low Risk"
    if (score <= 30) return "Medium Risk"
    return "High Risk"
  }

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#3b82f6']

  if (isLoading || !deviceData) {
    return (
      <div className="p-4 md:p-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const { device, blockedContent, activityLogs, timeUsage } = deviceData

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">Device ID: {device.id} • Last active: {new Date(device.lastActive).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className={`h-4 w-4 ${getRiskColor(device.riskScore)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{device.riskScore}/100</div>
                <div className={`text-sm font-medium ${getRiskColor(device.riskScore).replace('bg-', 'text-')}`}>
                  {getRiskLabel(device.riskScore)}
                </div>
              </div>
              <Progress value={device.riskScore} className="w-24 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Screen Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.totalScreenTime}</div>
            <p className="text-xs text-muted-foreground">Today's usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {device.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-2xl font-bold">{device.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Battery className="h-4 w-4 mr-1" />
                {device.batteryLevel}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.connectionType}</div>
            <p className="text-xs text-muted-foreground">{device.osVersion}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blocked Content Categories</CardTitle>
            <CardDescription>Content blocked by Aegis AI in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blockedContent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#32a852" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity Logs</CardTitle>
          <CardDescription>Security events and filtered activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.length > 0 ? (
                activityLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{log.time}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <Badge className={
                        log.riskLevel === "low" ? "bg-green-500" :
                        log.riskLevel === "medium" ? "bg-yellow-500" :
                        "bg-red-500"
                      }>
                        {log.riskLevel.charAt(0).toUpperCase() + log.riskLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No activity logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Categories Blocked</CardTitle>
            <CardDescription>Breakdown of blocked content types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blockedContent.length > 0 ? (
                blockedContent.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} attempts • {item.percentage}%
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No blocked content data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Usage Details</CardTitle>
            <CardDescription>Time spent per application category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeUsage.length > 0 ? (
                timeUsage.map((app, index) => (
                  <div key={app.app} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <div className="font-medium">{app.app}</div>
                        <div className="text-sm text-muted-foreground">{app.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{Math.floor(app.minutes / 60)}h {app.minutes % 60}m</div>
                      <div className="text-sm text-muted-foreground">{app.percentage}% of total</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No app usage data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}