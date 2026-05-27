import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getEvents, getPayments, getVendors } from "@/lib/jsonData"
import { Award, Star } from "lucide-react"

export default function Analytics() {
  const [events, setEvents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])

  useEffect(() => {
    const loadData = () => {
      try {
        const eventsData = getEvents()
        const userEventsData = JSON.parse(localStorage.getItem('userEvents') || '[]')
        const allEvents = [...eventsData, ...userEventsData].filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        )
        setEvents(allEvents)
        
        setPayments(getPayments())
        setVendors(getVendors())
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
    
    const handleDataUpdate = () => loadData()
    window.addEventListener('dataUpdated', handleDataUpdate)
    
    return () => window.removeEventListener('dataUpdated', handleDataUpdate)
  }, [])

  // Performance metrics based on real data
  const completedEventsCount = events.filter(e => e.status === 'Completed').length
  const totalEventsCount = events.length
  const cancelledEventsCount = events.filter(e => e.status === 'Cancelled').length
  const avgVendorRating = vendors.length > 0 ? vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / vendors.length : 0
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalEventBudget = events.reduce((sum, e) => sum + (parseInt(e.budget) || 0), 0)
  
  const performanceMetrics = {
    eventCompletionRate: totalEventsCount > 0 ? Math.round((completedEventsCount / totalEventsCount) * 100) : 0,
    vendorSatisfactionScore: avgVendorRating.toFixed(1),
    avgEventBudgetUtilization: totalEventBudget > 0 ? Math.round((totalSpent / totalEventBudget) * 100) : 0,
    onTimeDeliveryRate: totalEventsCount > 0 ? Math.round(((totalEventsCount - cancelledEventsCount) / totalEventsCount) * 100) : 0
  }

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Track your event performance, vendor satisfaction, and budget utilization metrics.
        </p>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Award className="mr-2 h-5 w-5 text-gray-600" /> Performance Metrics
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">{performanceMetrics.eventCompletionRate}%</div>
              <p className="text-sm text-gray-600 mt-1">Event Completion Rate</p>
            </div>
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900 flex items-center justify-center">
                <Star className="h-5 w-5 mr-1 text-gray-600" />{performanceMetrics.vendorSatisfactionScore}
              </div>
              <p className="text-sm text-gray-600 mt-1">Vendor Satisfaction</p>
            </div>
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">{performanceMetrics.avgEventBudgetUtilization}%</div>
              <p className="text-sm text-gray-600 mt-1">Budget Utilization</p>
            </div>
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">{performanceMetrics.onTimeDeliveryRate}%</div>
              <p className="text-sm text-gray-600 mt-1">On-Time Delivery</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}