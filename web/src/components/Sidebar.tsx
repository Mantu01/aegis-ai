'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, LayoutDashboard, Info, User, LogOut, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import ThemeToggler from './ThemeToggle'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'About', href: '/about', icon: Info },
]

const user = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '/avatar.png'
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  if (pathname === '/auth') return null

  return (
    <>
      <div className="hidden md:flex">
        <aside className={cn(
          "flex flex-col h-screen bg-card border-r transition-all duration-300",
          collapsed ? "w-17.5" : "w-52"
        )}>
          <div className="flex items-center justify-between p-3 border-b">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <Image
                    src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1766952786/aegis_yiswjc.png"
                    alt="Aegis AI"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-sm">Aegis AI</span>
              </div>
            )}
            {collapsed && (
              <div className="w-7 h-7 mx-auto">
                <div className="relative w-full h-full">
                  <Image
                    src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1766952786/aegis_yiswjc.png"
                    alt="Aegis AI"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-6 w-6"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
          </div>

          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2 h-8 px-2 text-xs",
                          isActive && "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                        )}
                      >
                        <item.icon size={14} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-2">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-2 px-1")}>
              <ThemeToggler/>
            </div>
          </div>

          <Separator />

          <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("w-full justify-start h-auto p-1", collapsed ? "justify-center" : "gap-2")}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white text-[10px]">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="font-medium text-xs truncate">{user.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Separator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 m-3">
              <ChevronRight size={14} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-52 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 p-3 border-b">
                <div className="relative w-7 h-7">
                  <Image
                    src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1766952786/aegis_yiswjc.png"
                    alt="Aegis AI"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-sm">Aegis AI</span>
              </div>

              <nav className="flex-1 p-2">
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-2 h-8 px-2 text-xs",
                              isActive && "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                            )}
                          >
                            <item.icon size={14} />
                            <span>{item.name}</span>
                          </Button>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="p-2">
                <div className="flex items-center justify-between px-1 mb-2">
                  <ThemeToggler />
                </div>
              </div>

              <Separator />

              <div className="p-2 backdrop-blur-2xl ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="font-medium text-xs truncate">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-green-400 to-green-600 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <Separator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}