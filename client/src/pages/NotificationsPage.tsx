import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getEvents, getPayments, getMessages } from "@/lib/jsonData"
import { Bell, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const [, setLocation] = useLocation()
  const [notifications, setNotifications] = useState<any[]>([])
  const [, setEvents] = useState<any[]>([])
  const [, setPayments] = useState<any[]>([])
  const [, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Set notifications as open when page loads
    localStorage.setItem('notificationsOpen', 'true');
    
    // Listen for bell toggle to close notifications
    const handleToggleNotifications = () => {
      console.log('Bell clicked on notifications page - going back to dashboard');
      setLocation('/vendor-dashboard');
    };
    
    window.addEventListener('toggleNotifications', handleToggleNotifications);
    
    const loadData = () => {
      try {
        const eventsData = getEvents()
        const userEventsData = JSON.parse(localStorage.getItem('userEvents') || '[]')
        const allEvents = [...eventsData, ...userEventsData].filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        )
        setEvents(allEvents)
        
        const paymentsData = getPayments()
        setPayments(paymentsData)
        
        const messagesData = getMessages()
        setMessages(messagesData)

        // Generate notifications from real data
        const realNotifications: any[] = []
        
        // Add payment notifications
        paymentsData.slice(0, 3).forEach((payment: any, index: number) => {
          realNotifications.push({
            id: index + 1,
            type: payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'warning' : 'info',
            message: `Payment ${payment.status} for ${payment.eventName}`,
            time: `${index + 1} hours ago`,
            read: index > 1
          })
        })
        
        // Add message notifications
        messagesData.slice(0, 2).forEach((_message: any, index: number) => {
          realNotifications.push({
            id: index + 4,
            type: 'info',
            message: `New message received`,
            time: `${index + 2} hours ago`,
            read: false
          })
        })
        
        setNotifications(realNotifications)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
    
    const handleDataUpdate = () => loadData()
    window.addEventListener('dataUpdated', handleDataUpdate)
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
      window.removeEventListener('toggleNotifications', handleToggleNotifications);
      // Set notifications as closed when component unmounts
      localStorage.setItem('notificationsOpen', 'false');
    }
  }, [])

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map((notif: any) => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter((notif: any) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map((notif: any) => ({ ...notif, read: true })))
  }

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">Notifications</h1>
        <p className="text-white/90">
          Stay updated with your latest activities, payments, and messages.
        </p>
      </div>

      {/* Notifications Management */}
      <Card className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-gray-600" /> Notifications ({notifications.filter(n => !n.read).length} unread)
            </h3>
            <Button variant="ghost" size="sm" className="bg-button-gradient text-white" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 border rounded-lg transition-colors ${
                notification.read ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        notification.type === 'success' ? 'bg-brand-purple' :
                        notification.type === 'warning' ? 'bg-brand-purple' :
                        'bg-brand-purple'
                      }`} />
                      <p className={`font-medium ${
                        notification.read ? 'text-brand-purple' : 'text-brand-purple'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-white hover:text-gray-200 bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}