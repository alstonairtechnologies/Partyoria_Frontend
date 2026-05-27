"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getVendors } from "@/lib/jsonData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Clock, Search, Award, TrendingUp, Zap, CheckCircle, DollarSign, Eye, Users, Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


export default function Dashboard() {
  const [userType, setUserType] = useState("customer")
  const [userName, setUserName] = useState("User")
  const [userId, setUserId] = useState<string | null>(null)

  const [, setNotifications] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [selectedActivityEvent, setSelectedActivityEvent] = useState<any>(null)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)

  const [, setWeatherData] = useState({ temp: 28, condition: "Sunny", humidity: 65 })
  
  useEffect(() => {
    // Clear old mock data
    try {
      localStorage.removeItem('payments');
      localStorage.removeItem('messages');
      localStorage.removeItem('approvals');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
    
    // Detect user type and name from session
    const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      const currentUserId = user.id || user.email || user.username
      setUserId(currentUserId)
      if (user.isVendor) {
        setUserType("vendor")
      }
      if (user.firstName) {
        setUserName(user.firstName)
      } else if (user.username) {
        setUserName(user.username)
      }
      
      // Force immediate data load
      loadRealTimeData(currentUserId);
    }
    

    
    // Listen for data updates
    const handleDataUpdate = () => {
      if (userStr) {
        const user = JSON.parse(userStr)
        const currentUserId = user.id || user.email || user.username
        loadRealTimeData(currentUserId);
      }
    };
    
    const handleStorageChange = () => {
      if (userStr) {
        const user = JSON.parse(userStr)
        const currentUserId = user.id || user.email || user.username
        loadRealTimeData(currentUserId);
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom navigation events that might indicate data changes
    const handleNavigation = () => {
      setTimeout(() => {
        if (userStr) {
          const user = JSON.parse(userStr)
          const currentUserId = user.id || user.email || user.username
          loadRealTimeData(currentUserId);
        }
      }, 100);
    };
    
    window.addEventListener('navigate', handleNavigation);
    
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      const currentUserStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      if (currentUserStr) {
        const user = JSON.parse(currentUserStr)
        const currentUserId = user.id || user.email || user.username
        loadRealTimeData(currentUserId);
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('navigate', handleNavigation);
      clearInterval(interval);
    };
  }, [])
  
  const loadRealTimeData = (currentUserId?: string) => {
    const activeUserId = currentUserId || userId;
    if (!activeUserId) return;
    
    try {
      // Load user-specific events
      const userEventsKey = `userEvents_${activeUserId}`;
      const userEventsData = JSON.parse(localStorage.getItem(userEventsKey) || '[]');
      setEvents(userEventsData);
      
      // Load user-specific payments
      const userPaymentsKey = `userPayments_${activeUserId}`;
      const paymentsData = JSON.parse(localStorage.getItem(userPaymentsKey) || '[]');
      setPayments(paymentsData);
      
      // Load user-specific messages
      const userMessagesKey = `userMessages_${activeUserId}`;
      const messagesData = JSON.parse(localStorage.getItem(userMessagesKey) || '[]');
      setMessages(messagesData);
    
    // Generate user-specific notifications
    const realNotifications: any[] = [];
    
    // Add payment notifications
    paymentsData.slice(0, 3).forEach((payment: any, index: number) => {
      realNotifications.push({
        id: index + 1,
        type: payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'warning' : 'info',
        message: `Payment ${payment.status} for ${payment.eventName}`,
        time: `${index + 1} hours ago`,
        read: index > 1
      });
    });
    
    // Add message notifications
    messagesData.slice(0, 2).forEach((_message: any, index: number) => {
      realNotifications.push({
        id: index + 4,
        type: 'info',
        message: `New message received`,
        time: `${index + 2} hours ago`,
        read: false
      });
    });
    
    setNotifications(realNotifications);
    
    // Load vendors from real data
    setVendors(getVendors());
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  }
  
  // Initialize user-specific data if not exists
  useEffect(() => {
    if (userId) {
      const userEventsKey = `userEvents_${userId}`;
      const userPaymentsKey = `userPayments_${userId}`;
      const userMessagesKey = `userMessages_${userId}`;
      
      if (!localStorage.getItem(userEventsKey)) {
        localStorage.setItem(userEventsKey, '[]');
      }
      if (!localStorage.getItem(userPaymentsKey)) {
        localStorage.setItem(userPaymentsKey, '[]');
      }
      if (!localStorage.getItem(userMessagesKey)) {
        localStorage.setItem(userMessagesKey, '[]');
      }
      
      // Force reload with current userId
      loadRealTimeData(userId);
    }
  }, [userId])

  // Force refresh when component becomes visible
  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        loadRealTimeData(userId);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [userId])
  
  // Stats based on real-time data
  const totalSpentAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalVendorsHired = events.reduce((sum, e) => sum + (e.vendorCount || e.vendors?.length || 0), 0)
  const upcomingEventsCount = events.filter(e => e.status === 'Planning' || e.status === 'Upcoming').length
  
  const customerStats = [
    {
      title: "My Events",
      value: events.length.toString(),
      icon: <CalendarIcon className="h-6 w-6 text-brand-purple" />,
      change: events.length > 0 ? `+${events.length}` : "",
      changeType: "increase",
    },
    {
      title: "Hired Vendors",
      value: totalVendorsHired.toString(),
      icon: <Users className="h-6 w-6 text-brand-coral" />,
      change: totalVendorsHired > 0 ? `+${totalVendorsHired}` : "",
      changeType: "increase",
    },
    {
      title: "Upcoming Events",
      value: upcomingEventsCount.toString(),
      icon: <Clock className="h-6 w-6 text-brand-purple" />,
      change: upcomingEventsCount > 0 ? `+${upcomingEventsCount}` : "",
      changeType: "neutral",
    },
    {
      title: "Total Spent",
      value: `₹${Math.round(totalSpentAmount / 1000)}K`,
      icon: <TrendingUp className="h-6 w-6 text-brand-coral" />,
      change: totalSpentAmount > 0 ? "+₹20K" : "",
      changeType: "increase",
    },
  ]
  
  const vendorStats = [
    {
      title: "Active Bookings",
      value: "24",
      icon: <CalendarIcon className="h-6 w-6 text-brand-purple" />,
      change: "+8",
      changeType: "increase",
    },
    {
      title: "Total Clients",
      value: "156",
      icon: <Users className="h-6 w-6 text-brand-coral" />,
      change: "+12",
      changeType: "increase",
    },
    {
      title: "Pending Requests",
      value: "7",
      icon: <Clock className="h-6 w-6 text-brand-purple" />,
      change: "+3",
      changeType: "increase",
    },
    {
      title: "Monthly Revenue",
      value: "₹2.8L",
      icon: <TrendingUp className="h-6 w-6 text-brand-coral" />,
      change: "+₹45K",
      changeType: "increase",
    },
  ]
  
  const stats = userType === "vendor" ? vendorStats : customerStats

  // Helper function to calculate time ago
  const getTimeAgo = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
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
      time: payment.createdAt ? getTimeAgo(payment.createdAt) : `${index + 1} hours ago`,
      status: payment.status,
      eventData: events.find(e => e.name === payment.eventName)
    })),
    ...events.slice(0, 2).map((event, index) => ({
      id: index + 4,
      type: "event",
      description: `Event: ${event.name}`,
      time: event.createdAt ? getTimeAgo(event.createdAt) : `${index + 2} days ago`,
      status: event.status?.toLowerCase() || 'active',
      eventData: event,
      amount: undefined
    })),
    ...messages.slice(0, 2).map((message, index) => ({
      id: index + 6,
      type: "message",
      description: `New message received`,
      time: message.createdAt ? getTimeAgo(message.createdAt) : `${index + 3} hours ago`,
      status: message.read ? 'read' : 'unread',
      amount: undefined
    }))
  ]

  const handleActivityView = (activity: any) => {
    if (activity.type === 'event' && activity.eventData) {
      setSelectedActivityEvent(activity.eventData)
      setIsActivityDialogOpen(true)
    }
  }

  // Budget analytics data based on real events and payments
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalEventBudget = events.reduce((sum, e) => sum + (parseInt(e.budget) || 0), 0)
  
  // Get unique hired vendors from all events
  
  // Create categories only for hired vendors with equal distribution
  




  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter((notif: any) => notif.id !== id))
  }

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update weather data
      setWeatherData(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() - 0.5) * 2
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Welcome Header */}
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome back, {userType === "vendor" ? `${userName}` : userName}
            </h1>
            <p className="text-white/90">
              {userType === "vendor" 
                ? "Manage your services and grow your business."
                : events.length > 0 
                  ? `You have ${events.length} event${events.length > 1 ? 's' : ''} to manage.`
                  : "Ready to plan your first event? Let's get started!"
              }
            </p>
          </div>
          {userType === "vendor" && (
            <div className="text-xs text-brand-purple font-medium">
              Vendor Account
            </div>
          )}
          {userType === "customer" && (
            <div className="text-xs text-brand-purple font-medium">
              Customer Account
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {userType === "vendor" ? (
            <>
              <Button 
                className="bg-button-gradient-1 text-brand-purple font-semibold border border-brand-purple"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'client-portal' });
                  window.dispatchEvent(event);
                }}
              >
                <Users className="mr-2 h-4 w-4 text-brand-purple" /> Manage Clients
              </Button>
              <Button 
                className="bg-button-gradient-2 text-white font-semibold"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'approvals' });
                  window.dispatchEvent(event);
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-white" /> View Requests
              </Button>
              <Button 
                className="bg-button-gradient-3 text-black font-semibold border border-gray-300"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'marketplace' });
                  window.dispatchEvent(event);
                }}
              >
                <Award className="mr-2 h-4 w-4 text-black" /> My Services
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="bg-button-gradient-1 text-brand-purple font-semibold border border-brand-purple"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'create-event' });
                  window.dispatchEvent(event);
                }}
              >
                <Zap className="mr-2 h-4 w-4 text-brand-purple" /> Create New Event
              </Button>
              <Button 
                className="bg-button-gradient-2 text-white font-semibold"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'browse-vendors' });
                  window.dispatchEvent(event);
                }}
              >
                <Search className="mr-2 h-4 w-4 text-white" /> Find Vendors
              </Button>
              <Button 
                className="bg-button-gradient-3 text-black font-semibold border border-gray-300"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'request-quote' });
                  window.dispatchEvent(event);
                }}
              >
                <FileText className="mr-2 h-4 w-4 text-black" /> Request Quote
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</h3>
                  {stat.change && (
                    <span
                      className={`text-xs ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                            ? "text-red-600"
                            : "text-gray-500"
                      }`}
                    >
                      {stat.change} this month
                    </span>
                  )}
                </div>
                <div className="p-2 rounded bg-gray-50">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Recent Activity with Actions */}
      <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Zap className="mr-2 h-4 w-4 text-gray-600" /> Recent Activity
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => userId && loadRealTimeData(userId)}
                className="bg-button-gradient text-white"
              >
                Refresh
              </Button>
              <Button variant="ghost" size="sm" className="bg-button-gradient text-white">
                View All
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="relative border-l-2 border-gray-200 pl-5 ml-3 space-y-6 py-1">
            {recentActivities.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="flex flex-col">
                <div className={`absolute -left-[11px] rounded-full w-5 h-5 flex items-center justify-center ${
                  activity.type === 'payment' ? 'bg-brand-coral' :
                  activity.type === 'event' ? 'bg-brand-purple' :
                  'bg-brand-gradient'
                }`}>
                  {activity.type === 'payment' && <DollarSign className="text-white h-3 w-3" />}
                  {activity.type === 'event' && <Calendar className="text-white h-3 w-3" />}
                  {activity.type !== 'payment' && activity.type !== 'event' && <CheckCircle className="text-white h-3 w-3" />}
                </div>
                <div className="-mt-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.description}</h4>
                      {activity.type === 'event' && activity.status && (
                        <p className="text-sm text-gray-600 mt-1">
                          Status: <span className="capitalize font-medium">{activity.status}</span>
                        </p>
                      )}
                      {activity.amount && (
                        <p className="text-sm text-gray-600 mt-1">Amount: {activity.amount}</p>
                      )}
                      <span className="text-xs text-gray-500 block mt-1">{activity.time}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-button-gradient text-white"
                      onClick={() => handleActivityView(activity)}
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Event Details Dialog for Recent Activity */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedActivityEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedActivityEvent.name || selectedActivityEvent.type}
                </DialogTitle>
                <DialogDescription>
                  Complete event details and information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Event Type</Label>
                      <p className="text-base font-medium">{selectedActivityEvent.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Date & Time</Label>
                      <p className="text-base">{selectedActivityEvent.date ? new Date(selectedActivityEvent.date).toLocaleDateString() : 'No date'} at {selectedActivityEvent.time || 'No time'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Location</Label>
                      <p className="text-base">{selectedActivityEvent.location || `${selectedActivityEvent.city || ''}, ${selectedActivityEvent.state || ''}`.trim().replace(/^,|,$/, '') || 'No location'}</p>
                    </div>
                    {selectedActivityEvent.address && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Address</Label>
                        <p className="text-base">{selectedActivityEvent.address}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Guest Count</Label>
                      <p className="text-base font-medium">{selectedActivityEvent.guestCount || selectedActivityEvent.guests || 0} people</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Budget</Label>
                      <p className="text-base font-medium text-green-600">₹{parseInt(selectedActivityEvent.budget || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={`${
                        selectedActivityEvent.status?.toLowerCase() === 'planning' ? 'bg-blue-100 text-blue-800' :
                        selectedActivityEvent.status?.toLowerCase() === 'upcoming' ? 'bg-green-100 text-green-800' :
                        selectedActivityEvent.status?.toLowerCase() === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedActivityEvent.status || 'Planning'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="text-base">{selectedActivityEvent.createdAt ? new Date(selectedActivityEvent.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedActivityEvent.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-base mt-1 p-3 bg-gray-50 rounded-lg">{selectedActivityEvent.description}</p>
                  </div>
                )}
                
                {selectedActivityEvent.requirements && selectedActivityEvent.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Special Requirements</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedActivityEvent.requirements.map((req: any, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">{req}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedActivityEvent.vendors && selectedActivityEvent.vendors.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Selected Vendors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedActivityEvent.vendors.map((vendor: any, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">{vendor}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedActivityEvent.status !== "Cancelled" && selectedActivityEvent.status !== "Completed" && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Planning Progress</Label>
                    <div className="mt-2">
                      <Progress value={selectedActivityEvent.progress || 0} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2 font-medium">{selectedActivityEvent.progress || 0}% complete</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}