import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Clock, DollarSign, CheckCircle, Bell, Calendar } from "lucide-react"

export default function Activities() {
  const [events, setEvents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

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
          const userPayments = JSON.parse(localStorage.getItem(userPaymentsKey) || '[]')
          setPayments(userPayments)
          
          const userMessagesKey = `userMessages_${userId}`
          const userMessages = JSON.parse(localStorage.getItem(userMessagesKey) || '[]')
          setMessages(userMessages)
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

  const getTimeAgo = (dateString: string | Date) => {
    if (!dateString) return 'just now'
    
    const now = new Date()
    const past = new Date(dateString)
    
    if (isNaN(past.getTime())) return 'just now'
    
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  // Generate recent activities from real data
  const recentActivities = [
    ...payments.slice(0, 3).map((payment, index) => ({
      id: index + 1,
      type: "payment",
      description: `Payment ${payment.status} for ${payment.eventName}`,
      amount: `₹${payment.amount?.toLocaleString()}`,
      time: getTimeAgo(payment.date || new Date(Date.now() - (index + 1) * 3600000)),
      status: payment.status
    })),
    ...events.slice(0, 2).map((event, index) => ({
      id: index + 4,
      type: "event",
      description: `Event: ${event.name || event.type}`,
      time: getTimeAgo(event.createdAt || event.date),
      status: event.status?.toLowerCase() || 'planning',
      amount: undefined
    })),
    ...messages.slice(0, 2).map((message, index) => ({
      id: index + 6,
      type: "message",
      description: `New message received`,
      time: getTimeAgo(message.timestamp || new Date(Date.now() - (index + 3) * 3600000)),
      status: message.read ? 'read' : 'unread',
      amount: undefined
    }))
  ]

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Activities</h1>
        <p className="text-white/90">
          Track all your recent activities including payments, events, and messages.
        </p>
      </div>

      {/* Recent Activities */}
      <Card className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-600" /> Recent Activities
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'payment' ? 'bg-gray-100 text-gray-600' :
                    activity.type === 'booking' ? 'bg-gray-100 text-gray-600' :
                    activity.type === 'message' ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'payment' && <DollarSign className="h-5 w-5" />}
                    {activity.type === 'booking' && <CheckCircle className="h-5 w-5" />}
                    {activity.type === 'message' && <Bell className="h-5 w-5" />}
                    {activity.type === 'event' && <Calendar className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {activity.amount && (
                    <span className="font-semibold text-gray-900">{activity.amount}</span>
                  )}
                  <Badge className="bg-gray-100 text-gray-700">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities</h3>
                <p className="text-gray-500">Your recent activities will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}