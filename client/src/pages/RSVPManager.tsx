import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone, CheckCircle, XCircle, Clock } from "lucide-react"

export default function RSVPManager() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [guests, setGuests] = useState<any[]>([])
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    status: "pending"
  })

  useEffect(() => {
    const loadData = () => {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      if (userId) {
        const userEventsKey = `userEvents_${userId}`
        const userEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]')
        setEvents(userEvents)
        
        const userGuestsKey = `eventGuests_${userId}`
        const savedGuests = JSON.parse(localStorage.getItem(userGuestsKey) || '[]')
        setGuests(savedGuests)
      }
    }
    
    loadData()
    
    // Listen for data updates
    window.addEventListener('dataUpdated', loadData)
    
    return () => {
      window.removeEventListener('dataUpdated', loadData)
    }
  }, [])

  const addGuest = () => {
    if (newGuest.name && newGuest.email && selectedEvent) {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?.email || user?.username
      
      const guest = {
        id: Date.now(),
        eventId: selectedEvent,
        ...newGuest,
        invitedAt: new Date().toISOString()
      }
      
      const updatedGuests = [...guests, guest]
      setGuests(updatedGuests)
      
      if (userId) {
        const userGuestsKey = `eventGuests_${userId}`
        localStorage.setItem(userGuestsKey, JSON.stringify(updatedGuests))
      }
      
      setNewGuest({ name: "", email: "", phone: "", status: "pending" })
    }
  }


  const eventGuests = guests.filter((g: any) => g.eventId === selectedEvent)
  const confirmedCount = eventGuests.filter((g: any) => g.status === 'confirmed').length
  const declinedCount = eventGuests.filter((g: any) => g.status === 'declined').length
  const pendingCount = eventGuests.filter((g: any) => g.status === 'pending').length

  return (
    <div className="p-6 w-full max-w-full mx-0 bg-white min-h-screen">
      <div className="bg-brand-gradient rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-semibold text-white mb-2">RSVP Manager</h1>
        <p className="text-white/90">Manage guest invitations and track responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Guest Form */}
        <Card className="lg:col-span-1 bg-white border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">Add Guest</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Select Event</Label>
              <Select value={selectedEvent} onValueChange={(value) => {
                setSelectedEvent(value)
                setNewGuest({ name: "", email: "", phone: "", status: "pending" })
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose event" />
                </SelectTrigger>
                <SelectContent>
                  {events.length > 0 ? events.map((event: any) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name || event.type}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-events" disabled>
                      No events found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Guest Name</Label>
              <Input
                value={newGuest.name}
                onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                placeholder="Full name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newGuest.email}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || /^[^\s@]+@[^\s@]*$/.test(value) || /^[^\s@]+$/.test(value)) {
                    setNewGuest({...newGuest, email: value})
                  }
                }}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                maxLength={10}
                value={newGuest.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    setNewGuest({...newGuest, phone: value})
                  }
                }}
                placeholder="10-digit phone number"
              />
            </div>

            <Button onClick={addGuest} className="w-full bg-button-gradient text-white">
              <Users className="mr-2 h-4 w-4 text-white" /> Add Guest
            </Button>
          </CardContent>
        </Card>

        {/* RSVP Overview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEvent && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{confirmedCount}</p>
                    <p className="text-sm text-gray-600">Confirmed</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{declinedCount}</p>
                    <p className="text-sm text-gray-600">Declined</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </CardContent>
                </Card>
              </div>

              {/* Guest List */}
              <Card className="bg-white border border-gray-200">
                <div className="border-b border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">Guest List</h3>
                </div>
                <CardContent className="p-6">
                  {eventGuests.length > 0 ? (
                    <div className="space-y-4">
                      {eventGuests.map((guest: any) => (
                        <div key={guest.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-gray-900">{guest.name}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {guest.email}
                                  </span>
                                  {guest.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {guest.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${
                              guest.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              guest.status === 'declined' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {guest.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNewGuest({
                                    name: guest.name,
                                    email: guest.email,
                                    phone: guest.phone,
                                    status: guest.status
                                  })
                                }}
                                className="bg-button-gradient text-white"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const updatedGuests = guests.filter((g: any) => g.id !== guest.id)
                                  setGuests(updatedGuests)
                                  setNewGuest({ name: "", email: "", phone: "", status: "pending" })
                                  const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user')
                                  const user = userStr ? JSON.parse(userStr) : null
                                  const userId = user?.id || user?.email || user?.username
                                  if (userId) {
                                    const userGuestsKey = `eventGuests_${userId}`
                                    localStorage.setItem(userGuestsKey, JSON.stringify(updatedGuests))
                                  }
                                }}
                                className="bg-button-gradient text-white"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No guests added</h4>
                      <p className="text-gray-500">Start adding guests to manage RSVPs</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!selectedEvent && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
                <p className="text-gray-500">Choose an event to manage guest RSVPs</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}