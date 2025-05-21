"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, BookOpen, DollarSign, Flag, LineChart, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"

// Mock data for admin dashboard
const stats = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12.5%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Listings",
    value: "1,875",
    change: "+8.2%",
    icon: BookOpen,
    trend: "up",
  },
  {
    title: "Completed Sales",
    value: "945",
    change: "+23.1%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$12,426",
    change: "+4.3%",
    icon: DollarSign,
    trend: "up",
  },
]

const recentReports = [
  {
    id: 1,
    user: "Emily Johnson",
    reason: "Inappropriate content",
    listing: "Advanced Physics Textbook",
    date: "2023-05-15",
    status: "Pending",
  },
  {
    id: 2,
    user: "Michael Smith",
    reason: "Misleading description",
    listing: "Computer Programming Basics",
    date: "2023-05-14",
    status: "Resolved",
  },
  {
    id: 3,
    user: "Jessica Williams",
    reason: "Suspected fraud",
    listing: "Calculus Made Easy",
    date: "2023-05-12",
    status: "Under review",
  },
  {
    id: 4,
    user: "David Brown",
    reason: "Item not as described",
    listing: "Introduction to Psychology",
    date: "2023-05-10",
    status: "Resolved",
  },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your platform, monitor activity, and review reports.
          </p>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div
                        className={`rounded-full p-2 ${
                          stat.trend === "up"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        stat.trend === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex h-[200px] items-center justify-center">
                    <LineChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <p className="ml-4 text-sm text-gray-500">Sales chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Categories</CardTitle>
                  <CardDescription>Most active book categories</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex h-[200px] items-center justify-center">
                    <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <p className="ml-4 text-sm text-gray-500">Category distribution chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Reports</CardTitle>
                <CardDescription>Latest reported issues from users</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">User</th>
                        <th className="pb-2 font-medium">Reason</th>
                        <th className="pb-2 font-medium">Listing</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.id} className="border-b last:border-0">
                          <td className="py-3">{report.user}</td>
                          <td className="py-3">{report.reason}</td>
                          <td className="py-3">{report.listing}</td>
                          <td className="py-3">{report.date}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                report.status === "Resolved"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                  : report.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/admin/reports">
                    <Button variant="outline" size="sm">
                      View All Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex h-[300px] items-center justify-center">
                  <Users className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <p className="ml-4 text-gray-500">User management interface would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Listings</CardTitle>
                <CardDescription>Manage all book listings across the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex h-[300px] items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <p className="ml-4 text-gray-500">Book listings management interface would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>Review and manage reported content and user complaints.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex h-[300px] items-center justify-center">
                  <Flag className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <p className="ml-4 text-gray-500">Reports management interface would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-gray-500">Platform settings interface would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
