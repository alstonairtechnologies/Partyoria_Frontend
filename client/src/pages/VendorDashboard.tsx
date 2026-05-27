import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, IndianRupee, Star, Bell, LogIn, Plus, Edit, Trash2, X } from "lucide-react"


export default function VendorDashboard() {
  const [userName, setUserName] = useState<string>("Vendor")
  const [userId, setUserId] = useState<string | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [earnings, setEarnings] = useState<number>(0)
  const [clients, setClients] = useState<number>(0)
  const [services, setServices] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [, setLoginSessions] = useState<any[]>([])
  const [newLoginAlert, setNewLoginAlert] = useState<boolean>(false)
  const [vendorProfile, setVendorProfile] = useState<any>({})
  const [showServiceForm, setShowServiceForm] = useState<boolean>(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [serviceFormData, setServiceFormData] = useState<any>({})
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false)

  useEffect(() => {
    initializeVendor()
    
    return () => {}
  }, [])

  useEffect(() => {
    if (userId) {
      try {
        initializeUserData()
        loadVendorData()
        
        const handleUserLogin = () => loadVendorData()
        window.addEventListener('userLogin', handleUserLogin)
        
        const interval = setInterval(loadVendorData, 30000)
        
        return () => {
          window.removeEventListener('userLogin', handleUserLogin)
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Error in useEffect:', error)
      }
    }
  }, [userId])

  const initializeVendor = () => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        const id = user.id || user.username || 'default'
        setUserId(id)
        setUserName(user.firstName || user.username || 'Vendor')
        
        if (user.isVendor) {
          trackLogin(id)
        }
      }
    } catch (error) {
      console.error('Error initializing vendor:', error)
      setUserId('default')
      setUserName('Vendor')
    }
  }

  const initializeUserData = () => {
    try {
      const keys = [
        `vendorBookings_${userId}`, 
        `vendor_services_${userId}`, 
        `vendor_login_sessions_${userId}`,
        `vendor_profile_${userId}`,
        `vendor_portfolio_${userId}`,
        `vendor_pricing_${userId}`,
        `vendor_availability_${userId}`
      ]
      keys.forEach(key => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, key.includes('profile') ? '{}' : '[]')
        }
      })
    } catch (error) {
      console.error('Error initializing user data:', error)
    }
  }

  const saveService = () => {
    if (!serviceFormData.name || !serviceFormData.category || !serviceFormData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const serviceData = {
      ...serviceFormData,
      id: editingService ? editingService.id : Date.now(),
      createdAt: editingService ? editingService.createdAt : new Date().toISOString()
    };

    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? serviceData : s);
    } else {
      updatedServices = [...services, serviceData];
    }

    setServices(updatedServices);
    localStorage.setItem(`vendor_services_${userId}`, JSON.stringify(updatedServices));
    setShowServiceForm(false);
    setEditingService(null);
    setServiceFormData({});
  };

  const deleteService = (serviceIndex: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter((_, index) => index !== serviceIndex);
      setServices(updatedServices);
      localStorage.setItem(`vendor_services_${userId}`, JSON.stringify(updatedServices));
    }
  };

  const loadVendorData = () => {
    if (!userId) return
    
    try {
      const vendorBookings = JSON.parse(localStorage.getItem(`vendorBookings_${userId}`) || '[]')
      const vendorServices = JSON.parse(localStorage.getItem(`vendor_services_${userId}`) || '[]')
      const sessions = JSON.parse(localStorage.getItem(`vendor_login_sessions_${userId}`) || '[]')
      const profile = JSON.parse(localStorage.getItem(`vendor_profile_${userId}`) || '{}')
      
      setBookings(vendorBookings)
      setServices(vendorServices)
      setLoginSessions(sessions)
      setVendorProfile(profile)
      
      const totalEarnings = vendorBookings.reduce((sum: number, b: any) => {
        const budget = b?.budget ? parseInt(b.budget, 10) : 0
        return sum + (isNaN(budget) ? 0 : budget)
      }, 0)
      setEarnings(totalEarnings)
      
      const clientIds = vendorBookings.map((b: any) => b?.clientId).filter(Boolean)
      setClients(new Set(clientIds).size)
      
      const vendorNotifications = vendorBookings.slice(0, 3).map((booking: any, index: number) => {
        const status = booking?.status || 'pending'
        const eventType = booking?.eventType || 'Event'
        return {
          id: index + 1,
          type: status === 'confirmed' ? 'success' : 'info',
          message: `Booking ${status} for ${eventType}`,
          time: booking.createdAt ? getTimeAgo(booking.createdAt) : `${index + 1} hours ago`
        }
      })
      
      setNotifications(vendorNotifications)
    } catch (error) {
      console.error('Error loading vendor data:', error)
      setBookings([])
      setServices([])
      setLoginSessions([])
      setNotifications([])
      setEarnings(0)
      setClients(0)
    }
  }

  const trackLogin = (userId: string) => {
    try {
      const sessionKey = `vendor_login_sessions_${userId}`
      const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]')
      
      const recentSession = sessions.find((session: any) => {
        const sessionTime = new Date(session.timestamp)
        const timeDiff = new Date().getTime() - sessionTime.getTime()
        return timeDiff < 5 * 60 * 1000
      })
      
      if (!recentSession) {
        const newSession = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 50),
          ip: 'Local'
        }
        
        const updatedSessions = [newSession, ...sessions.slice(0, 9)]
        localStorage.setItem(sessionKey, JSON.stringify(updatedSessions))
        setLoginSessions(updatedSessions)
      }
    } catch (error) {
      console.error('Error tracking login:', error)
      setLoginSessions([])
      setNewLoginAlert(false)
    }
  }

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




  const activeBookingsCount = bookings.filter((b: any) => b?.status === 'confirmed').length
  
  const vendorStats = [
    {
      title: "Active Bookings",
      value: activeBookingsCount.toString(),
      icon: <Calendar className="h-6 w-6 text-brand-purple" />,
      change: activeBookingsCount > 0 ? `+${activeBookingsCount}` : ""
    },
    {
      title: "Total Clients",
      value: clients.toString(),
      icon: <Users className="h-6 w-6 text-brand-coral" />,
      change: clients > 0 ? `+${clients}` : ""
    },
    {
      title: "Total Services",
      value: services.length.toString(),
      icon: <Star className="h-6 w-6 text-brand-purple" />,
      change: services.length > 0 ? `+${services.length}` : ""
    },
    {
      title: "Monthly Revenue",
      value: `₹${Math.round(earnings / 1000)}K`,
      icon: <IndianRupee className="h-6 w-6 text-brand-coral" />,
      change: earnings > 0 ? `+₹${Math.round(earnings / 1000)}K` : ""
    }
  ]

  
  
  

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      {newLoginAlert && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <LogIn className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            New login detected to your vendor account just now.
          </AlertDescription>
        </Alert>
      )}

      {notifications.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-orange-800 flex items-center">
                <Bell className="mr-2 h-4 w-4" /> Recent Notifications
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
                Clear All
              </Button>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-700">{notification.message}</span>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome back, {userName}
            </h1>
            <p className="text-white/90">
              {vendorProfile.businessName ? `Managing ${vendorProfile.businessName}` : 'Complete your profile to start getting bookings'}
            </p>
          </div>
          <div className="flex gap-2">

            <Button 
              onClick={() => {
                setEditingService(null);
                setServiceFormData({});
                setShowServiceForm(true);
              }}
              className="bg-white text-brand-purple hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {vendorStats.map((stat, index) => (
          <Card key={index} className="bg-white border border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</h3>
                  {stat.change && (
                    <span className="text-xs text-green-600">
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



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-600" /> Recent Bookings
            </h3>
          </div>
          <CardContent className="p-6">
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.clientName || `Client ${index + 1}`}</p>
                      <p className="text-sm text-gray-500">{booking.eventType || 'Event'} • {booking.eventDate || 'No date'}</p>
                      {booking.budget && <p className="text-sm text-green-600">₹{parseInt(booking.budget).toLocaleString()}</p>}
                    </div>
                    <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {booking.status || 'pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No bookings yet</p>
                <p className="text-sm text-gray-400">Complete your profile to start receiving bookings</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Star className="mr-2 h-5 w-5 text-gray-600" /> My Services
              </h3>
              <Button 
                onClick={() => {
                  setEditingService(null);
                  setServiceFormData({});
                  setShowServiceForm(true);
                }}
                size="sm"
                className="bg-button-gradient text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            {services.length > 0 ? (
              <div className="space-y-3">
                {services.slice(0, 4).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.category}</p>
                      <p className="text-sm text-green-600">₹{parseInt(service.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingService(service);
                          setServiceFormData(service);
                          setShowServiceForm(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteService(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-white bg-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No services added</p>
                <p className="text-sm text-gray-400">Add your first service to showcase your offerings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="bg-brand-gradient rounded-t-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-2">Notifications</h1>
                  <p className="text-white/90">Stay updated with your latest activities, payments, and messages.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNotificationModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-gray-600" /> Notifications (0 unread)
                </h3>
                <Button variant="ghost" size="sm" className="bg-button-gradient text-white">
                  Mark All Read
                </Button>
              </div>
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowServiceForm(false);
                  setEditingService(null);
                  setServiceFormData({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name *</label>
                <input 
                  type="text" 
                  maxLength={100}
                  value={serviceFormData.name || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9\s&.-]/g, '');
                    setServiceFormData({...serviceFormData, name: value});
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Enter service name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select 
                  value={serviceFormData.category || ''}
                  onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Catering">Catering</option>
                  <option value="Decoration">Decoration</option>
                  <option value="DJ">DJ</option>
                  <option value="Photography">Photography</option>
                  <option value="Venue">Venue</option>
                  <option value="Cake">Cake</option>
                  <option value="Mehendi">Mehendi</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  value={serviceFormData.price || ''}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    setServiceFormData({...serviceFormData, price: value.toString()});
                  }}
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  className="w-full p-2 border rounded"
                  placeholder="Enter price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={serviceFormData.description || ''}
                  onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                  className="w-full p-2 border rounded" 
                  rows={3}
                  placeholder="Service description"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={saveService}
                  className="flex-1 bg-button-gradient text-white"
                >
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    setServiceFormData({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


    </div>
  )
}