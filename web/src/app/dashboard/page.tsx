"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Trash2, Eye, EyeOff, ExternalLink, Shield, Smartphone, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { tokenAPI, dashboardAPI, deviceAPI, Device, Token, DashboardStats } from "@/lib/api"

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [tokens, setTokens] = useState<Token[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    totalScreenTime: "0h 0m",
    averageRiskScore: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)
  const [expirationDays, setExpirationDays] = useState("30")
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set())

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [devicesData, tokensData, statsData] = await Promise.all([
        dashboardAPI.getDevices(),
        tokenAPI.getAll(),
        dashboardAPI.getStats()
      ])
      setDevices(devicesData)
      setTokens(tokensData)
      setStats(statsData)
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error(error.response?.data?.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const generateToken = async () => {
    if (!expirationDays || parseInt(expirationDays) <= 0) {
      toast.error("Please enter a valid number of days")
      return
    }

    setIsGeneratingToken(true)
    
    try {
      const newToken = await tokenAPI.create(parseInt(expirationDays))
      setTokens([newToken, ...tokens])
      toast.success(`New token generated! It will expire in ${expirationDays} days`)
    } catch (error: any) {
      console.error("Error generating token:", error)
      toast.error(error.response?.data?.message || "Failed to generate token")
    } finally {
      setIsGeneratingToken(false)
    }
  }

  const deleteToken = async (id: string) => {
    try {
      await tokenAPI.delete(id)
      setTokens(tokens.filter(token => token.id !== id))
      toast.success("Token deleted successfully")
    } catch (error: any) {
      console.error("Error deleting token:", error)
      toast.error(error.response?.data?.message || "Failed to delete token")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Token copied to clipboard")
  }

  const toggleTokenVisibility = (id: string) => {
    const newVisible = new Set(visibleTokens)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleTokens(newVisible)
  }

  const getRiskBadge = (score: number) => {
    if (score <= 10) {
      return <Badge className="bg-green-500 hover:bg-green-600">Safe</Badge>
    } else if (score <= 30) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">High Risk</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">Connected devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screen Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScreenTime}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRiskScore}</div>
            <p className="text-xs text-muted-foreground">Across all devices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Access Tokens</CardTitle>
              <CardDescription>Manage tokens for device connections</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Generate Token</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New Token</DialogTitle>
                  <DialogDescription>
                    Create a new access token for connecting devices to Aegis AI
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiration">Expiration (days)</Label>
                    <Input
                      id="expiration"
                      type="number"
                      min="1"
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(e.target.value)}
                      placeholder="Enter number of days"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={generateToken} disabled={isGeneratingToken}>
                    {isGeneratingToken ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Generate Token"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Device Connected</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {visibleTokens.has(token.id) ? token.token : "••••••••••••••••••••••••••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTokenVisibility(token.id)}
                        className="h-8 w-8"
                        title={visibleTokens.has(token.id) ? "Hide token" : "Show token"}
                      >
                        {visibleTokens.has(token.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {token.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 border-gray-300">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {token.hasDeviceConnected ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Connected</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                          <span className="text-sm font-medium text-gray-500">Not Connected</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{token.expiresAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(token.token)}
                        className="h-8 w-8"
                        title="Copy token"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteToken(token.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete token"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>Monitor and manage protected devices</CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No devices found</h3>
              <p className="text-sm mb-6">
                No devices are currently connected. Generate a token and connect a device to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {devices.map((device) => (
                <Card key={device.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      {device.isActive ? (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">{device.riskScore}</span>
                        {getRiskBadge(device.riskScore)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Active</span>
                      <span className="text-sm">{device.lastActive}</span>
                    </div>
                    <Link href={`/dashboard/${device.id}`} className="w-full flex justify-center items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}