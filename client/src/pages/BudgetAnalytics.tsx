import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"

export default function BudgetAnalytics() {
  const [events, setEvents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")

  useEffect(() => {
    const loadData = () => {
      try {
        const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
        const user = userStr ? JSON.parse(userStr) : null
        const userId = user?.id || user?.email || user?.username
        
        if (userId) {
          const userEventsKey = `userEvents_${userId}`
          const userEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]')
          setEvents(userEvents)
          
          const userPaymentsKey = `userPayments_${userId}`
          const paymentsData = JSON.parse(localStorage.getItem(userPaymentsKey) || '[]')
          setPayments(paymentsData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
    
    const handleDataUpdate = () => loadData()
    window.addEventListener('dataUpdated', handleDataUpdate)
    
    return () => window.removeEventListener('dataUpdated', handleDataUpdate)
  }, [])

  // Get selected event data
  const currentEvent = events.find(e => e.id.toString() === selectedEvent)
  
  // Budget analytics data for selected event
  const eventBudget = currentEvent ? parseInt(currentEvent.budget) || 0 : 0
  const eventPayments = payments.filter(p => p.eventId === selectedEvent)
  const eventSpent = eventPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  
  // Get vendors for selected event
  const eventVendors = currentEvent?.vendors || []
  
  // Create categories for selected event vendors
  const budgetCategories = eventVendors.length > 0 ? eventVendors.map((vendor: any) => {
    const equalShare = 1 / eventVendors.length
    const allocated = eventBudget * equalShare
    const vendorPayments = eventPayments.filter(p => p.vendor === vendor)
    const spent = vendorPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    return {
      name: vendor,
      allocated,
      spent,
      percentage: allocated > 0 ? (spent / allocated) * 100 : 0
    }
  }) : []
  
  const budgetData = {
    totalBudget: eventBudget,
    spent: eventSpent,
    remaining: Math.max(eventBudget - eventSpent, 0),
    categories: budgetCategories
  }

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Budget Analytics</h1>
        <p className="text-white/90">
          Track your event spending, manage budgets, and analyze costs across different vendor categories.
        </p>
      </div>

      {/* Event Selection */}
      <Card className="bg-white border border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="max-w-md">
            <Label>Select Event</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event to analyze" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.name || event.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <>
          {/* Budget Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-semibold text-gray-900">₹{(budgetData.totalBudget / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <PieChart className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Amount Spent</p>
                <p className="text-2xl font-semibold text-gray-900">₹{(budgetData.spent / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-semibold text-gray-900">₹{(budgetData.remaining / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Vendor Category Breakdown */}
      <Card className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-gray-600" /> Vendor Category Breakdown
          </h3>
        </div>
        <CardContent className="p-6">
          {budgetCategories.length > 0 ? (
            <div className="space-y-6">
              {budgetCategories.map((category: any, index: number) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      ₹{(category.spent / 1000).toFixed(0)}K / ₹{(category.allocated / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{category.percentage.toFixed(1)}% utilized</span>
                    <span>₹{((category.allocated - category.spent) / 1000).toFixed(0)}K remaining</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Budget Data</h3>
              <p className="text-gray-500">Create events and hire vendors to see budget breakdown</p>
            </div>
          )}
        </CardContent>
          </Card>
        </>
      )}

      {!selectedEvent && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
            <p className="text-gray-500">Choose an event to view its budget analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}